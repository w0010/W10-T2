<!-- Polyspace.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import * as THREE from 'three';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
	import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
	import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
	import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
	import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

	import { theme, polyspaceColors } from '$lib/theme';
	import { scrollStore } from '$lib/scrollStore';
	import { browser } from '$app/environment'; // Import the browser utility
	import type { Unsubscriber } from 'svelte/motion';

	let scene: THREE.Scene;
	const cameraDistance = 350;
	let camera: THREE.PerspectiveCamera;
	let orthoCamera: THREE.OrthographicCamera;
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

	let meshRotator: THREE.Group;

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
			scene.fog = new THREE.Fog(0xebebeb, 100, 2048);

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

			const ambientLight = new THREE.AmbientLight(0xebebeb, 1); // White light, 50% intensity
			scene.add(ambientLight);

			ambientLight.layers.enable(1);
			
			const directionalLight = new THREE.DirectionalLight(0xebebeb, 1);
			directionalLight.position.set(1, -1, 0); // Adjust position as needed
			scene.add(directionalLight);
			const directionalLight2 = new THREE.DirectionalLight(0xebebeb, 1);
			directionalLight2.position.set(-1, 1, 0); // Adjust position as needed
			scene.add(directionalLight2);
			const directionalLight3 = new THREE.DirectionalLight(0xebebeb, 1);
			directionalLight3.position.set(0, 0, 1); // Adjust position as needed
			scene.add(directionalLight3);

			directionalLight.layers.enable(1);
			directionalLight2.layers.enable(1);
			directionalLight3.layers.enable(1);

			renderer = new THREE.WebGLRenderer({ antialias: false });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.autoClear = true;
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

			polyGeo = new THREE.TetrahedronGeometry(1024);
			polyMat = new THREE.MeshPhysicalMaterial({
				color: background,
				metalness: 0.5, // Adjust metalness and roughness as needed
				roughness: 0.5,
				side: THREE.DoubleSide
			});
			polyMesh = new THREE.Mesh(polyGeo, polyMat);

			
			wireGeo = new THREE.TetrahedronGeometry(1024);
			const edgesGeometry = new THREE.EdgesGeometry(wireGeo);
			wireMat = new THREE.LineBasicMaterial({
				color: foreground,
				depthTest: false,
				fog: false
			});
			wireMesh = new THREE.LineSegments(edgesGeometry, wireMat);
			wireMesh.renderOrder = 1;
			
			coreGeo = new THREE.DodecahedronGeometry(window.innerHeight / 7.3, 3);
			coreMat = new THREE.MeshPhysicalMaterial({
				color: background,
				transparent: true,
				metalness: 0.5, // Adjust metalness and roughness as needed
				roughness: 0.5,
				clearcoat: 0.1
			});
			coreMesh = new THREE.Mesh(coreGeo, coreMat);
			coreMesh.renderOrder = 2;
			coreMesh.layers.set(1);
			
			meshRotator = new THREE.Group();
			meshRotator.add(polyMesh);
			meshRotator.add(wireMesh);
			meshRotator.add(coreMesh);
			scene.add(meshRotator);

			//movement

			const update = () => {
				mouseX = ease(targetMouseX, mouseX);
				mouseY = ease(targetMouseY, mouseY);
				scroll = ease(targetScroll, scroll);

				const mouseQuaternion = new THREE.Quaternion().multiplyQuaternions(
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 2, 1), mouseX * 0.0003),
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), mouseY * 0.0006)
				);
				const scrollQuaternion = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(-1, 0, 0),
					scroll * 0.0008
				);
				meshRotator.quaternion.multiplyQuaternions(mouseQuaternion, scrollQuaternion);
			};

			unsubscribeScroll = scrollStore.subscribe(($scrollstore) => {
				const { distanceToBottom } = $scrollStore;
				const fadeDistance = 256; // Distance over which the fade-in effect occurs

				// Calculate opacity based on distance to bottom
				let opacityControl = Math.max(1 - distanceToBottom / fadeDistance, 0);

				if (coreMesh.material instanceof THREE.MeshPhysicalMaterial) {
					coreMesh.material.opacity = opacityControl;
				}
				
			});

			const footerHeight = window.innerHeight;
			const transitionEnd = document.body.scrollHeight - footerHeight;

			const animate = () => {
				requestAnimationFrame(animate);
				update();

				// Render the scene with the perspective camera
				renderer.autoClear = true; // Ensure the renderer clears the previous frame
				camera.layers.set(0); // Use the perspective camera for layer 0
				scene.background = new THREE.Color(background);
				composer.render(); // Render everything except the core mesh

				// Clear the depth buffer, then render only the core with the orthographic camera
				renderer.autoClear = false; // Do not clear the color buffer
				renderer.clearDepth(); // Clear depth to ensure the core mesh is rendered on top
				orthoCamera.layers.set(1); // Use the orthographic camera for layer 1 (core mesh)
				scene.background = null;
				renderer.render(scene, orthoCamera); // Render only the core mesh
			};

			animate();

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

			handleMouseMove = (event: MouseEvent) => {
				targetMouseX = event.clientX - window.innerWidth / 2;
				targetMouseY = event.clientY - window.innerHeight / 2;
			};

			handleTouchMove = (event: TouchEvent) => {
				if (event.touches.length > 0) {
					targetMouseX = event.touches[0].clientX - window.innerWidth / 2;
					targetMouseY = event.touches[0].clientY - window.innerHeight / 2;
				}
			};

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
		const { background, foreground } = polyspaceColors[currentThemeKey];
		if (scene && polyMat && wireMat) {
			scene.background = new THREE.Color(background);
			polyMat.color.set(background);
			coreMat.color.set(background);
			wireMat.color.set(foreground);
		}
	}

	$: if ($theme) {
		updateScene($theme as keyof typeof polyspaceColors);
	}
</script>

<div bind:this={container} id="polyspace" />
