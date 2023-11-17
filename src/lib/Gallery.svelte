<!-- Gallery.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import ImageModal from '$lib/ImageModal.svelte';
	let images: string[] = [];
	let selectedImage: string | null = null;

	onMount(async () => {
		try {
			const res = await fetch('api/images');
			if (res.ok) {
				const data = await res.json();
				images = data.images; // Make sure this matches the structure of your JSON response
			} else {
				console.error('Fetch error:', res.statusText);
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error('Error fetching images:', err.message);
			} else {
				console.error('An unexpected error occurred');
			}
		}
	});

	function openModal(imageSrc: string) {
		selectedImage = imageSrc;
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

{#if selectedImage}
	<ImageModal src={selectedImage} alt="Expanded tattoo photograph" on:close={closeModal} />
{/if}

<div class="gallery">
	{#each images as imageSrc (imageSrc)}
		<button on:click={() => openModal(imageSrc)}>
			<img src={imageSrc} alt="Tattoo photograph thumbnail" />
		</button>
	{/each}
</div>

<style>
	
	.gallery button {
		aspect-ratio: 1 / 1;
		background: none;
		border: none;
		margin: 0;
		padding: 0;
		display: flex; /* Ensures content is properly aligned */
	}
	
	.gallery button img {
		width: 100%;
		height: 100%;
		border-radius: 8px; /* optional, for styling */
		object-fit: cover;
	}

	.gallery {
		display: grid;
		gap: 4px;
		margin-left: var(--margin);
		margin-right: var(--margin);
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	}

	@media (max-width: 1440px) {
		.gallery {
			grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.gallery {
			grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		}
	}
</style>
