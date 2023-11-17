<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	export let src: string;
	export let alt: string;
	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	// Set initial focus to the modal content for accessibility
	onMount(() => {
		const modalContent: HTMLElement | null = document.querySelector('.modal-content');
		modalContent?.focus();
	});
</script>

<div
	class="modal-overlay"
	on:click={handleClose}
	on:keydown={handleKeydown}
	role="presentation"
	tabindex="-1"
>
	<div class="modal-content" role="dialog" aria-modal="true" aria-label="Image modal" tabindex="-1">
		<img {src} {alt} />
		<button on:click={handleClose} aria-label="Close modal">✖</button>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 1em;
		z-index: 99;
	}
	.modal-content {
		background: var(--dark);
		border-radius: 4px;
		display: flex;
		flex-direction: column-reverse;
		gap: 4px;
		max-height: 100vh;
		padding: 4px;
		position: relative;
		box-shadow: 0px 4px 256px var(--dark);
	}
	.modal-content img {
		border-radius: 4px;
		max-width: 100%;
		max-height: 95vh;
	}
	.modal-content button {
		align-items: center;
		align-self: flex-end;
		background: none;
		border: none;
		color: var(--light);
		cursor: pointer;
		display: flex;
		font-size: 1rem;
		justify-content: center;
		width: 1.5em;
		height: 1.25em;
	}
</style>
