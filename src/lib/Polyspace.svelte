<!-- Polyspace.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { theme, polyspaceColors } from '$lib/theme';
	import { browser } from '$app/environment'; // Import the browser utility

	let container: HTMLElement;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let geometry: THREE.TetrahedronGeometry;
	let material: THREE.MeshPhongMaterial;
	let lineMaterial: THREE.LineBasicMaterial;
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
			//			scene.fog = new THREE.Fog(foreground, 1, 1000);

			camera = new THREE.PerspectiveCamera(
				150,
				window.innerWidth / window.innerHeight,
				0.01,
				10000
			);
			camera.position.z = zoom;

			renderer = new THREE.WebGLRenderer({ antialias: true });
			const maxPixelRatio = Math.min(window.devicePixelRatio, 2); // Limiting to 2 for performance
			renderer.setPixelRatio(maxPixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(renderer.domElement);

			geometry = new THREE.TetrahedronGeometry(1000);
			material = new THREE.MeshPhongMaterial({
				flatShading: true,
				transparent: true,
				opacity: 0.125,
				shininess: 20,
				side: THREE.BackSide
				//  wireframe: true
			});
			lineMaterial = new THREE.LineBasicMaterial({
				transparent: true,
				opacity: 1
			});
			const mesh = new THREE.Mesh(geometry, material);

			mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), lineMaterial));

			meshRotator = new THREE.Group();
			meshRotator.add(mesh);
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
				renderer.render(scene, camera);
			};

			animate();

			handleResize = (event: UIEvent) => {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
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
		if (scene && material && lineMaterial) {
			scene.background = new THREE.Color(background);
			//			scene.fog = new THREE.Fog(foreground, 1, 1000);
			material.color.set(background);
			lineMaterial.color.set(foreground);
		}
	}

	$: if ($theme) {
		updateScene($theme as keyof typeof polyspaceColors);
	}
</script>

<div bind:this={container} id="polyspace" />
