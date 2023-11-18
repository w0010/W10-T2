<!-- Polyspace.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
	import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
	import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
	import { theme, polyspaceColors } from '$lib/theme';
	import { browser } from '$app/environment'; // Import the browser utility

	let container: HTMLElement;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let geometry: THREE.TetrahedronGeometry;
	let material: THREE.MeshPhongMaterial;
	let wireMaterial: THREE.LineBasicMaterial;
	let meshRotator: THREE.Group;
	const zoom = 350;

	let mouseX = 0,
		mouseY = 0,
		scroll = 0;
	let targetMouseX = 0,
		targetMouseY = 0,
		targetScroll = 0;

	let handleMouseMove: (event: MouseEvent) => void;
	let handleTouchMove: (event: TouchEvent) => void;
	let handleResize: (event: UIEvent) => void;

	const ease = (target: number, current: number) => {
		const easeFactor = 0.01;
		return current + (target - current) * easeFactor;
	};

	onMount(() => {
		if (browser) {
			const currentThemeKey = $theme as keyof typeof polyspaceColors;
			const { background, foreground } = polyspaceColors[currentThemeKey];

			scene = new THREE.Scene();
			scene.background = new THREE.Color(background);
			scene.fog = new THREE.FogExp2(foreground, 9999);

			camera = new THREE.PerspectiveCamera(
				150,
				window.innerWidth / window.innerHeight,
				0.01,
				10000
			);
			camera.position.z = zoom;

			renderer = new THREE.WebGLRenderer({ antialias: false });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(renderer.domElement);

			// Set up post-processing chain
			const composer = new EffectComposer(renderer);
			const renderPass = new RenderPass(scene, camera);
			composer.addPass(renderPass);

			// FXAA pass
			const fxaaPass = new ShaderPass(FXAAShader);
			const pixelRatio = renderer.getPixelRatio();
			fxaaPass.material.uniforms['resolution'].value.set(
				1 / (window.innerWidth * pixelRatio),
				1 / (window.innerHeight * pixelRatio)
			);
			composer.addPass(fxaaPass);

			geometry = new THREE.TetrahedronGeometry(1000);
			material = new THREE.MeshPhongMaterial({
				flatShading: true,
				transparent: true,
				opacity: 0.125,
				shininess: 20,
				side: THREE.BackSide
			});
			const mesh = new THREE.Mesh(geometry, material);

			const wireGeometry = new THREE.TetrahedronGeometry(900);
			wireMaterial = new THREE.LineBasicMaterial({
				color: foreground
			});
			const wire = new THREE.LineSegments(wireGeometry, wireMaterial);

			meshRotator = new THREE.Group();
			meshRotator.add(mesh);
			meshRotator.add(wire);
			scene.add(meshRotator);

			updateScene($theme as keyof typeof polyspaceColors);

			//movement

			const update = () => {
				mouseX = ease(targetMouseX, mouseX);
				mouseY = ease(targetMouseY, mouseY);
				scroll = ease(targetScroll, scroll);

				const mouseQuaternion = new THREE.Quaternion().multiplyQuaternions(
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), mouseX * 0.0006),
					new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), mouseY * 0.0003)
				);
				const scrollQuaternion = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(1, 0, 0),
					scroll * 0.0015
				);
				meshRotator.quaternion.multiplyQuaternions(mouseQuaternion, scrollQuaternion);
				mesh.rotation.x += 0.0003;
				//camera.position.x = ease(mouseX, camera.position.x) * 1;
				//camera.position.y = ease(-mouseY, camera.position.y) * 1;
			};

			const animate = () => {
				requestAnimationFrame(animate);
				update();
				composer.render();
			};

			animate();

			handleResize = (event: UIEvent) => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);

				// Update composer and FXAA pass on resize
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
		}
	});

	//Cleanup
	onDestroy(() => {
		if (browser) {
			window.onscroll = null;
			window.removeEventListener('resize', () => {});
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('touchmove', handleTouchMove);
		}
	});

	function updateScene(currentThemeKey: keyof typeof polyspaceColors) {
		const { background, foreground } = polyspaceColors[currentThemeKey];
		if (scene && material && wireMaterial) {
			scene.background = new THREE.Color(background);
			scene.fog = new THREE.FogExp2(foreground, .17);
			material.color.set(background);
			wireMaterial.color.set(foreground);
		}
	}

	$: if ($theme) {
		updateScene($theme as keyof typeof polyspaceColors);
	}
</script>

<div bind:this={container} id="polyspace" />
