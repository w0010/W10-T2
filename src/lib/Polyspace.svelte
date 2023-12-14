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

	let idleRotation = 0;

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
			const currentThemeKey = $theme as keyof typeof polyspaceColors;
			const { background, foreground } = polyspaceColors[currentThemeKey];

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(137, window.innerWidth / window.innerHeight, 1, 2048);
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

			// Lights
			// const ambientLight = new THREE.AmbientLight(0xebebeb, 0); // White light, 50% intensity
			// scene.add(ambientLight);
			// ambientLight.layers.enable(1);

			const directionalLight = new THREE.DirectionalLight(0xebebeb, 0.33);
			directionalLight.position.set(-0.5, -1.25, 0); // Adjust position as needed
			scene.add(directionalLight);
			directionalLight.layers.enable(1);

			const directionalLight2 = new THREE.DirectionalLight(0xebebeb, 0.33);
			directionalLight2.position.set(1, 0.2, 0); // Adjust position as needed
			scene.add(directionalLight2);
			directionalLight2.layers.enable(1);

			const directionalLight3 = new THREE.DirectionalLight(0xebebeb, 0.33);
			directionalLight3.position.set(0, 0, 1); // Adjust position as needed
			scene.add(directionalLight3);

			directionalLight3.layers.enable(1);

			const directionalLight4 = new THREE.DirectionalLight(0xebebeb, 0.33);
			directionalLight4.position.set(-1, 1, 0); // Adjust position as needed
			scene.add(directionalLight4);

			directionalLight4.layers.enable(1);
			// render and post-processing

			renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.autoClear = true;
			container.appendChild(renderer.domElement);

			const composer = new EffectComposer(renderer);
			composer.addPass(new RenderPass(scene, camera));
			composer.addPass(new FilmPass(0.23, false));
			const fxaaPass = new ShaderPass(FXAAShader);
			const pixelRatio = renderer.getPixelRatio();
			fxaaPass.material.uniforms['resolution'].value.set(
				1 / (window.innerWidth * pixelRatio),
				1 / (window.innerHeight * pixelRatio)
			);
			composer.addPass(fxaaPass);
			composer.addPass(new OutputPass());

			// #######  #######  #######
			// ##       ##       ##   ##
			// ##   ##  ######   ##   ##
			// ##   ##  ##       ##   ##
			// #######  #######  #######

			polyGeo = new THREE.TetrahedronGeometry(1024);
			polyMat = new THREE.MeshPhysicalMaterial({
				color: background,
				transparent: true,
				opacity: 0.12,
				side: THREE.BackSide
			});
			polyMesh = new THREE.Mesh(polyGeo, polyMat);

			wireGeo = new THREE.TetrahedronGeometry(1024);
			const edgesGeometry = new THREE.EdgesGeometry(wireGeo);
			wireMat = new THREE.LineBasicMaterial({
				transparent: true,
				opacity: 0.42,
				depthTest: false,
				fog: false
			});
			wireMesh = new THREE.LineSegments(edgesGeometry, wireMat);
			wireMesh.renderOrder = 1;

			function getVmin() {
				return Math.min(window.innerWidth, window.innerHeight);
			}
			const vmin = getVmin();

			let coreSize = vmin * 0.066;
			coreGeo = new THREE.DodecahedronGeometry(
				Math.min(window.innerWidth, window.innerHeight) * 0.07,
				3
			);
			coreMat = new THREE.MeshPhysicalMaterial({
				transparent: true,
				metalness: 0.23, // Adjust metalness and roughness as needed
				roughness: 0.42
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
				{ frequency: 3, amplitude: Math.PI / 2.3, phase: 0, damping: 0.005 }, // Rotary pendulum
				{ frequency: 3, amplitude: coreSize * 2.25, phase: Math.PI / 2, damping: 0.009 }, // x
				{ frequency: 9, amplitude: coreSize * 2.25, phase: Math.PI / 2, damping: 0.002 }, // y
				{ frequency: 6, amplitude: coreSize * 2.25, phase: Math.PI / 2, damping: 0.007 } // z
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

					const theta = // Calculate the rotational angle from the rotary pendulum
						pendulums[0].amplitude *
						Math.exp(-pendulums[0].damping * t) *
						Math.cos(pendulums[0].frequency * t + pendulums[0].phase);

					x += // Calculate the X Y Z positions from the linear pendulums
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

					const rotatedXZ = x * Math.cos(theta) - y * Math.sin(theta);
					const rotatedYZ = x * Math.sin(theta) + y * Math.cos(theta);
					const rotatedXY = rotatedXZ * Math.cos(theta) + z * Math.sin(theta);
					const rotatedZY = z * Math.cos(theta) - rotatedXZ * Math.sin(theta);
					const rotatedYX = rotatedYZ * Math.cos(theta) - rotatedZY * Math.sin(theta);
					const rotatedZX = rotatedZY * Math.sin(theta) + rotatedYZ * Math.cos(theta);
					const finalX = rotatedXY;
					const finalY = rotatedYX;
					const finalZ = rotatedZX;

					// Add the computed point to the points array
					points.push(new THREE.Vector3(finalX, finalY, finalZ));
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

			const harmonoGeo = new THREE.TubeGeometry(curve, 1024 * 32, 0.5, 8, false);

			harmonoMat = new THREE.MeshPhysicalMaterial({
				transparent: true,
				metalness: 0.23, // Adjust metalness and roughness as needed
				roughness: 0.42
			});
			harmonoMesh = new THREE.Mesh(harmonoGeo, harmonoMat);
			harmonoMesh.renderOrder = 2;
			harmonoMesh.layers.enable(1);

			spaceRotator = new THREE.Group();
			coreRotator = new THREE.Group();
			spaceRotator.add(polyMesh);
			spaceRotator.add(wireMesh);
			coreRotator.add(harmonoMesh);
			scene.add(spaceRotator);
			scene.add(coreRotator);

			//
			//
			// handle user inputs (more animation)
			//
			//

			let isHovering = false; // track hover state
			handleMouseMove = (event: MouseEvent) => {
				const mouse = new THREE.Vector2();
				const button = document.querySelector('.answer button');

				mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				targetMouseX = event.clientX - window.innerWidth / 2;
				targetMouseY = event.clientY - window.innerHeight / 2;

				let forwardTween = new TWEEN.Tween(harmonoMesh.rotation)
					.to({ x: Math.PI / 4, y: Math.PI / 4, z: 2.4 }, 500)
					.easing(TWEEN.Easing.Exponential.InOut);
				let reverseTween = new TWEEN.Tween(harmonoMesh.rotation)
					.to({ x: 0, y: 0, z: 0 }, 667) // Resetting y and z rotations
					.easing(TWEEN.Easing.Exponential.InOut);

				if (button) {
					const rect = button.getBoundingClientRect();
					const currentlyHovering =
						event.clientX >= rect.left &&
						event.clientX <= rect.right &&
						event.clientY >= rect.top &&
						event.clientY <= rect.bottom;
					if (currentlyHovering !== isHovering) {
						isHovering = currentlyHovering;
						if (isHovering) {
							reverseTween.stop(); // Stop the reverse tween
							forwardTween = new TWEEN.Tween(harmonoMesh.rotation) // Reinitialize the tween from current position
								.to({ x: Math.PI / 4, y: Math.PI / 4, z: 2.4 }, 500)
								.easing(TWEEN.Easing.Exponential.InOut);
							forwardTween.start();
						} else {
							forwardTween.stop(); // Stop the forward tween
							reverseTween = new TWEEN.Tween(harmonoMesh.rotation) // Reinitialize the tween from current position
								.to({ x: 0, y: 0, z: 0 }, 667) // Resetting y and z rotations
								.easing(TWEEN.Easing.Exponential.InOut);
							reverseTween.start();
						}
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

			// Create a CubeCamera
			// const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024 * 2); // Adjust size for performance vs quality
			// const cubeCamera = new THREE.CubeCamera(0.1, 2000, cubeRenderTarget);
			// cubeCamera.position.set(0, 0, 0);
			// scene.add(cubeCamera);

			// polyMat.envMap = cubeRenderTarget.texture;

			// function updateEnvironmentMap() {
			// 	polyMesh.visible = false;
			// 	coreMesh.visible = false;
			// 	harmonoMesh.visible = false;

			// 	renderer.setRenderTarget(cubeRenderTarget);
			// 	renderer.clear();
			// 	cubeCamera.update(renderer, scene);
			// 	renderer.setRenderTarget(null);

			// 	const reflectiveMaterial = polyMesh.material as THREE.MeshPhysicalMaterial;
			// 	reflectiveMaterial.envMap = cubeRenderTarget.texture;
			// 	reflectiveMaterial.needsUpdate = true;
			// 	polyMesh.visible = true;
			// 	wireMesh.visible = true;
			// 	coreMesh.visible = true;
			// 	harmonoMesh.visible = true;
			// }

			// function updateButtonPosition() {
			// 	const vector = new THREE.Vector3();
			// 	const canvasBounds = renderer.domElement.getBoundingClientRect();

			// 	// Convert 3D position to screen space
			// 	coreMesh.updateMatrixWorld();
			// 	vector.setFromMatrixPosition(coreMesh.matrixWorld);
			// 	vector.project(orthoCamera);

			// 	vector.x = (vector.x * 0.5 + 0.5) * canvasBounds.width + canvasBounds.left;
			// 	vector.y = -(vector.y * 0.5 - 0.5) * canvasBounds.height + canvasBounds.top;

			// 	// Update HTML button position
			// 	const button = document.querySelector('.answer button');
			// 	if (button instanceof HTMLElement) {
			// 		const buttonWidth = button.offsetWidth;
			// 		const buttonHeight = button.offsetHeight;
			// 		button.style.position = 'absolute';
			// 		button.style.left = `${vector.x - buttonWidth / 2}px`; // Center horizontally
			// 		button.style.top = `${vector.y - buttonHeight / 2}px`; // Center vertically
			// 		button.style.border = '2px solid red';
			// 	}
			// }

			const update = () => {
				mouseX = ease(targetMouseX, mouseX);
				mouseY = ease(targetMouseY, mouseY);
				scroll = ease(targetScroll, scroll);
				const maxScroll = document.body.scrollHeight - window.innerHeight;
				const invertedScroll = maxScroll - scroll;
				const normalizedScroll = Math.max(0, Math.min(1, invertedScroll / maxScroll)); // converts range to 0-1

				// Use the normalized scroll value to determine the rotation
				const scrollRotation = normalizedScroll * Math.PI * 2; // Full rotation at the top

				const mouseQuaternion = new THREE.Quaternion().multiplyQuaternions(
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 2, 1), mouseX * 0.0003),
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), mouseY * 0.0006)
				);
				const scrollQuaternionForSpace = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(-1, 0, 0),
					invertedScroll * 0.002
				);
				const scrollQuaternionForCore = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(1, 1, -1),
					scrollRotation
				);
				spaceRotator.quaternion.multiplyQuaternions(mouseQuaternion, scrollQuaternionForSpace); // default 0 rotation at scrolltop, rotated at bottom
				coreRotator.quaternion.multiplyQuaternions(mouseQuaternion, scrollQuaternionForCore); // 0 rotation at Bottom, rotated at scrolltop (for correct orientation when at bottom)

				const rotationIncrement = 0.0004; // Adjust this value for subtleness

				idleRotation += rotationIncrement; // Increment total rotation
				const incrementalQuaternionX = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(1, 0, 0),
					idleRotation
				);
				spaceRotator.quaternion.multiply(incrementalQuaternionX);
				coreRotator.quaternion.multiply(incrementalQuaternionX);
			};

			const animate = () => {
				requestAnimationFrame(animate);
				// updateEnvironmentMap();
				// updateButtonPosition();
				TWEEN.update();

				update();

				// Render the scene with the perspective camera
				renderer.autoClear = true; // Ensure the renderer clears the previous frame
				camera.layers.set(0); // Use the perspective camera for layer 0
				composer.render(); // Render everything except the core mesh

				// Clear the depth buffer, then render only the core with the orthographic camera
				renderer.autoClear = false; // Do not clear the color buffer
				renderer.clearDepth(); // Clear depth to ensure the core mesh is rendered on top
				// orthoCamera.layers.set(1); // Use the orthographic camera for layer 1 (core mesh)
				// renderer.render(scene, orthoCamera); // Render only the core mesh
			};

			animate();

			unsubscribeScroll = scrollStore.subscribe(($scrollstore) => {
				const { distanceToBottom } = $scrollStore;
				const fadeDistance = window.innerHeight / 2; // Distance over which the fade-in effect occurs

				// Calculate opacity based on distance to bottom
				let opacityMax = 0.23;
				let opacityControl = Math.max(opacityMax - distanceToBottom / fadeDistance, 0);

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
		console.log('w10: Updating scene for', currentThemeKey, 'theme');
		const { background, foreground } = polyspaceColors[currentThemeKey];
		if (scene && polyMat && wireMat) {
			scene.fog = new THREE.Fog(foreground, 100, 4096);
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

<div bind:this={container} id="polyspace" />

<style>
	:global(canvas) {
		background-color: var(--bg-color);
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
	}
</style>
