<!-- Polyspace.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Unsubscriber } from 'svelte/motion';
	import { browser } from '$app/environment'; // Import the browser utility

	import * as THREE from 'three';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
	import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
	import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
	import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
	import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

	import TWEEN from '@tweenjs/tween.js';

	import { theme, polyspaceColors } from '$lib/theme';
	import { scrollStore } from '$lib/scrollStore';

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let orthoCamera: THREE.OrthographicCamera;

	const cameraDistance = 350;
	const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 500); // Plane perpendicular to z-axis

	let renderer: THREE.WebGLRenderer;
	let container: HTMLElement;

	let polyGeo: THREE.TetrahedronGeometry;
	let polyMat: THREE.MeshPhysicalMaterial;
	let polyMesh: THREE.Mesh;

	let wireGeo: THREE.TetrahedronGeometry;
	let wireMat: THREE.LineBasicMaterial;
	let wireMesh: THREE.LineSegments;

	let coreGeo: THREE.DodecahedronGeometry;
	let coreMat: THREE.MeshPhysicalMaterial;
	let coreMesh: THREE.Mesh;

	let harmonographGeo: THREE.BufferGeometry;
	let harmonoMat: THREE.MeshPhysicalMaterial;
	let harmonoMesh: THREE.Mesh;

	let spaceRotator: THREE.Group;
	let coreRotator: THREE.Group;

	let mouseX = 0,
		mouseY = 0,
		scroll = 0;
	let targetMouseX = 0,
		targetMouseY = 0,
		targetScroll = 0;

	let unsubscribeScroll: Unsubscriber;
	let handleMouseMove: (event: MouseEvent) => void;
	let handleTouchMove: (event: TouchEvent) => void;
	let handleResize: (event: UIEvent) => void;

	const ease = (target: number, current: number) => {
		const easeFactor = 0.08;
		return current + (target - current) * easeFactor;
	};

	onMount(() => {
		if (browser) {
			const aspect = window.innerWidth / window.innerHeight;
			const currentThemeKey = $theme as keyof typeof polyspaceColors;
			const { background, foreground } = polyspaceColors[currentThemeKey];

			scene = new THREE.Scene();
			scene.fog = new THREE.Fog(background, 100, 2048);

			camera = new THREE.PerspectiveCamera(137, aspect, 1, 2000);
			camera.position.set(0, 0, cameraDistance);

			orthoCamera = new THREE.OrthographicCamera(
				window.innerWidth / -2,
				window.innerWidth / 2,
				window.innerHeight / 2,
				window.innerHeight / -2,
				1,
				1000
			);
			orthoCamera.position.set(0, 0, cameraDistance);
			orthoCamera.lookAt(0, 0, 0);
			orthoCamera.layers.enable(1);

			// Lights
			const ambientLight = new THREE.AmbientLight(0xebebeb, 1); // White light, 50% intensity
			scene.add(ambientLight);
			ambientLight.layers.enable(1);

			const directionalLight = new THREE.DirectionalLight(0xebebeb, 1);
			directionalLight.position.set(0.5, 1.25, 0); // Adjust position as needed
			scene.add(directionalLight);
			directionalLight.layers.enable(1);

			const directionalLight2 = new THREE.DirectionalLight(0xebebeb, 1);
			directionalLight2.position.set(-1, 0.2, 1); // Adjust position as needed
			scene.add(directionalLight2);
			directionalLight2.layers.enable(1);

			const directionalLight3 = new THREE.DirectionalLight(0xebebeb, 1);
			directionalLight3.position.set(0, -1, -1.5); // Adjust position as needed
			scene.add(directionalLight3);
			directionalLight3.layers.enable(1);

			// render and post-processing

			renderer = new THREE.WebGLRenderer({ antialias: false });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.autoClear = true;
			renderer.localClippingEnabled = true;
			container.appendChild(renderer.domElement);

			const composer = new EffectComposer(renderer);
			composer.addPass(new RenderPass(scene, camera));
			composer.addPass(new FilmPass(0.2, false));
			const fxaaPass = new ShaderPass(FXAAShader);
			const pixelRatio = renderer.getPixelRatio();
			fxaaPass.material.uniforms['resolution'].value.set(
				1 / (window.innerWidth * pixelRatio),
				1 / (window.innerHeight * pixelRatio)
			);
			composer.addPass(fxaaPass);

			const outputPass = new OutputPass();
			composer.addPass(outputPass);

			//
			//
			// Geometries
			//
			//

			polyGeo = new THREE.TetrahedronGeometry(1024);
			polyMat = new THREE.MeshPhysicalMaterial({
				color: background,
				transparent: true,
				opacity: 0,
				metalness: 0.5, // Adjust metalness and roughness as needed
				roughness: 0.5,
				side: THREE.BackSide
			});
			polyMesh = new THREE.Mesh(polyGeo, polyMat);

			wireGeo = new THREE.TetrahedronGeometry(1024);
			const edgesGeometry = new THREE.EdgesGeometry(wireGeo);
			wireMat = new THREE.LineBasicMaterial({
				color: foreground,
				depthTest: false,
				fog: true
			});
			wireMesh = new THREE.LineSegments(edgesGeometry, wireMat);
			wireMesh.renderOrder = 1;

			function getVmin() {
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				return Math.min(vw, vh);
			}
			const vmin = getVmin();

			let coreSize = vmin * 0.1;
			coreGeo = new THREE.DodecahedronGeometry(coreSize, 3);
			coreMat = new THREE.MeshPhysicalMaterial({
				color: foreground,
				transparent: true,
				metalness: 0.5, // Adjust metalness and roughness as needed
				roughness: 0.5,
				clearcoat: 0.5
			});
			coreMesh = new THREE.Mesh(coreGeo, coreMat);
			coreMesh.renderOrder = 3;
			coreMesh.layers.set(1);

			interface Pendulum {
				frequency: number;
				amplitude: number;
				phase: number;
				damping: number;
			}

			let pendulums: Pendulum[] = [
				{ frequency: 2, amplitude: Math.PI / 2.3, phase: 0, damping: 0.005 }, // Rotary pendulum
				{ frequency: 2.006, amplitude: coreSize * 2.5, phase: Math.PI / 2, damping: 0.009 },
				{ frequency: 3.001, amplitude: coreSize * 2.5, phase: Math.PI / 2, damping: 0.002 },
				{ frequency: 1, amplitude: 256, phase: Math.PI / -4, damping: 0.007 }
			];

			function createHarmonographGeo(
				duration: number,
				pendulums: Pendulum[],
				steps: number = 50000
			): THREE.BufferGeometry {
				const points: THREE.Vector3[] = [];
				for (let i = 0; i < steps; i++) {
					const t = (duration / steps) * i;
					let x = 0,
						y = 0,
						z = 0;

					// Calculate the rotational angle from the rotary pendulum
					const theta =
						pendulums[0].amplitude *
						Math.exp(-pendulums[0].damping * t) *
						Math.cos(pendulums[0].frequency * t + pendulums[0].phase);

					// Calculate the X and Y positions from the lateral pendulums
					x +=
						pendulums[1].amplitude *
						Math.exp(-pendulums[1].damping * t) *
						Math.cos(pendulums[1].frequency * t + pendulums[1].phase);
					y +=
						pendulums[2].amplitude *
						Math.exp(-pendulums[2].damping * t) *
						Math.sin(pendulums[2].frequency * t + pendulums[2].phase);
					z +=
						pendulums[3].amplitude *
						Math.exp(-pendulums[3].damping * t) *
						Math.sin(pendulums[3].frequency * t + pendulums[3].phase);

					// Apply the rotation to x and y
					const rotatedX = x * Math.cos(theta) - y * Math.sin(theta);
					const rotatedY = x * Math.sin(theta) + y * Math.cos(theta);
					const rotatedZ = x * Math.sin(theta) - y * Math.sin(theta); // made-up bullshit; maybe correct later (looks good now though)

					// Add the computed point to the points array
					points.push(new THREE.Vector3(rotatedX, rotatedY, rotatedZ)); // Z is zero unless you want to simulate 3D tilting
				}

				// Return the BufferGeometry made from the points
				return new THREE.BufferGeometry().setFromPoints(points);
			}

			harmonographGeo = createHarmonographGeo(96, pendulums);

			const positions = harmonographGeo.attributes.position;
			const points = [];
			for (let i = 0; i < positions.count; i++) {
				points.push(new THREE.Vector3().fromBufferAttribute(positions, i));
			}

			const curve = new THREE.CatmullRomCurve3(points);
			const harmonoGeo = new THREE.TubeGeometry(curve, 8192, 1, 32, false);
			harmonoMat = new THREE.MeshPhysicalMaterial({
				color: foreground,
				transparent: true,
				metalness: 0.5, // Adjust metalness and roughness as needed
				roughness: 0.5,
				clearcoat: 0.5
			});
			harmonoMesh = new THREE.Mesh(harmonoGeo, harmonoMat);
			harmonoMesh.renderOrder = 2;
			harmonoMesh.layers.set(1);

			polyMat.clippingPlanes = [clipPlane];
			polyMat.clipIntersection = false;
			wireMat.clippingPlanes = [clipPlane];
			wireMat.clipIntersection = false;

			spaceRotator = new THREE.Group();
			coreRotator = new THREE.Group();
			spaceRotator.add(polyMesh);
			spaceRotator.add(wireMesh);
			coreRotator.add(coreMesh);
			coreRotator.add(harmonoMesh);
			scene.add(spaceRotator);
			scene.add(coreRotator);

			//
			//
			// handle user inputs
			//
			//

			let isHovering = false; // track hover state
			let isAnimating = false; // track if animation is currently playing

			handleMouseMove = (event: MouseEvent) => {
				const raycaster = new THREE.Raycaster();
				const mouse = new THREE.Vector2();
				targetMouseX = event.clientX - window.innerWidth / 2;
				targetMouseY = event.clientY - window.innerHeight / 2;
				mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

				raycaster.setFromCamera(mouse, orthoCamera);
				raycaster.layers.set(1);

				let forwardTween = new TWEEN.Tween(harmonoMesh.rotation)
					.to({ x: Math.PI / 4, y: Math.PI / 4, z: Math.PI / 4 }, 667)
					.easing(TWEEN.Easing.Exponential.InOut)
					.onStart(() => {
						isAnimating = true;
					})
					.onComplete(() => {
						isAnimating = false;
					});
				let reverseTween = new TWEEN.Tween(harmonoMesh.rotation)
					.to({ x: 0, y: 0, z: 0 }, 667) // Resetting y and z rotations
					.easing(TWEEN.Easing.Exponential.InOut)
					.onStart(() => {
						isAnimating = false;
					})
					.onComplete(() => {
						isAnimating = false;
					});

				const intersects = raycaster.intersectObjects([coreMesh]);
				let currentlyHovering = intersects.length > 0;

				if (currentlyHovering !== isHovering) {
					isHovering = currentlyHovering;
					if (isHovering) {
						reverseTween.stop(); // Stop the reverse tween
						forwardTween = new TWEEN.Tween(harmonoMesh.rotation) // Reinitialize the tween from current position
							.to({ x: Math.PI / 4, y: Math.PI / 4, z: Math.PI / 4 }, 667)
							.easing(TWEEN.Easing.Exponential.InOut)
							.onStart(() => {
								isAnimating = true;
							})
							.onComplete(() => {
								isAnimating = false;
							});
						forwardTween.start();
					} else {
						forwardTween.stop(); // Stop the forward tween
						reverseTween = new TWEEN.Tween(harmonoMesh.rotation) // Reinitialize the tween from current position
							.to({ x: 0, y: 0, z: 0 }, 667) // Resetting y and z rotations
							.easing(TWEEN.Easing.Exponential.InOut)
							.onStart(() => {
								isAnimating = true;
							})
							.onComplete(() => {
								isAnimating = false;
							});
						reverseTween.start();
					}
				}
			};

			handleTouchMove = (event: TouchEvent) => {
				if (event.touches.length > 0) {
					targetMouseX = event.touches[0].clientX - window.innerWidth / 2;
					targetMouseY = event.touches[0].clientY - window.innerHeight / 2;
				}
			};

			handleResize = (event: UIEvent) => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);

				composer.setSize(window.innerWidth, window.innerHeight);
				const pixelRatio = renderer.getPixelRatio();
				fxaaPass.material.uniforms['resolution'].value.set(
					1 / (window.innerWidth * pixelRatio),
					1 / (window.innerHeight * pixelRatio)
				);
			};

			//
			//
			// Animation
			//
			//

			const update = () => {
				mouseX = ease(targetMouseX, mouseX);
				mouseY = ease(targetMouseY, mouseY);
				scroll = ease(targetScroll, scroll);

				// Calculate the maximum scrollable height of the document
				const maxScroll = document.body.scrollHeight - window.innerHeight;

				// Invert the scroll value so it's 0 at the bottom and maxScroll at the top
				const invertedScroll = maxScroll - scroll;

				// Normalize the inverted scroll position to a value between 0 and 1
				const normalizedScroll = Math.max(0, Math.min(1, invertedScroll / maxScroll));

				// Use the normalized scroll value to determine the rotation
				const scrollRotation = normalizedScroll * Math.PI * 2; // Full rotation at the top

				const mouseQuaternion = new THREE.Quaternion().multiplyQuaternions(
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 2, 1), mouseX * 0.0003),
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), mouseY * 0.0006)
				);
				const scrollQuaternionForSpace = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(1, 0, 0),
					scroll * 0.0008
				);
				const scrollQuaternionForCore = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(1, 1, -1),
					scrollRotation
				);
				spaceRotator.quaternion.multiplyQuaternions(mouseQuaternion, scrollQuaternionForSpace); // default 0 rotation at scrolltop, rotated at bottom
				coreRotator.quaternion.multiplyQuaternions(mouseQuaternion, scrollQuaternionForCore); // 0 rotation at Bottom, rotated at scrolltop
			};

			function updateButtonPosition() {
				const vector = new THREE.Vector3();
				const canvasBounds = renderer.domElement.getBoundingClientRect();

				// Convert 3D position to screen space
				coreMesh.updateMatrixWorld();
				vector.setFromMatrixPosition(coreMesh.matrixWorld);
				vector.project(orthoCamera);

				vector.x = (vector.x * 0.5 + 0.5) * canvasBounds.width + canvasBounds.left;
				vector.y = -(vector.y * 0.5 - 0.5) * canvasBounds.height + canvasBounds.top;

				// Update HTML button position
				const button = document.querySelector('.answer button');
				if (button instanceof HTMLElement) {
					const buttonWidth = button.offsetWidth;
					const buttonHeight = button.offsetHeight;
					button.style.position = 'absolute';
					button.style.left = `${vector.x - buttonWidth / 2}px`; // Center horizontally
					button.style.top = `${vector.y - buttonHeight / 2}px`; // Center vertically
					button.style.border = '2px solid red';
				}
			}

			const animate = () => {
				requestAnimationFrame(animate);
				updateButtonPosition();
				TWEEN.update();
				update();

				// Render the scene with the perspective camera
				renderer.autoClear = true; // Ensure the renderer clears the previous frame
				camera.layers.set(0); // Use the perspective camera for layer 0
				composer.render(); // Render everything except the core mesh

				// Clear the depth buffer, then render only the core with the orthographic camera
				renderer.autoClear = false; // Do not clear the color buffer
				renderer.clearDepth(); // Clear depth to ensure the core mesh is rendered on top
				orthoCamera.layers.set(1); // Use the orthographic camera for layer 1 (core mesh)
				renderer.render(scene, orthoCamera); // Render only the core mesh
			};

			animate();

			unsubscribeScroll = scrollStore.subscribe(($scrollstore) => {
				const { distanceToBottom } = $scrollStore;
				const fadeDistance = window.innerHeight / 3; // Distance over which the fade-in effect occurs

				// Calculate opacity based on distance to bottom
				let opacityControl = Math.max(1 - distanceToBottom / fadeDistance, 0);

				if (coreMesh.material instanceof THREE.MeshPhysicalMaterial) {
					coreMesh.material.opacity = opacityControl;
				}
				if (harmonoMesh.material instanceof THREE.MeshPhysicalMaterial) {
					harmonoMesh.material.opacity = opacityControl;
				}
			});
			window.onscroll = () => (targetScroll = window.scrollY);
			window.addEventListener('resize', handleResize);
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('touchmove', handleTouchMove);
			updateScene($theme as keyof typeof polyspaceColors);
		}
	});

	//Cleanup
	onDestroy(() => {
		if (unsubscribeScroll) {
			unsubscribeScroll();
		}
		if (browser) {
			window.onscroll = null;
			window.removeEventListener('resize', () => {});
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('touchmove', handleTouchMove);
		}
	});

	function updateScene(currentThemeKey: keyof typeof polyspaceColors) {
		console.log('w10: Updating scene for theme:', currentThemeKey);
		const { background, foreground } = polyspaceColors[currentThemeKey];
		if (scene && polyMat && wireMat) {
			scene.fog = new THREE.Fog(background, 100, 2048);
			polyMat.color.set(background);
			wireMat.color.set(foreground);
			coreMat.color.set(foreground);
			harmonoMat.color.set(foreground);
		}
	}

	$: if ($theme) {
		updateScene($theme as keyof typeof polyspaceColors);
	}
</script>

<div bind:this={container} id="polyspace" style="z-index: 9999" />