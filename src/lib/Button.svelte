<!-- Buttons.svelte -->
<script lang="ts">
	export let tfPopup = '';
</script>

<button data-tf-popup={tfPopup}>
	<span>
		<slot />
	</span>
	<svg class="corner"
		><path d="M0,8 L0,0 L8,0" stroke="var(--text-color)" stroke-width="2" fill="none" /></svg
	>
	<svg class="corner"
		><path d="M0,0 L8,0 L8,8" stroke="var(--text-color)" stroke-width="2" fill="none" /></svg
	>
	<svg class="corner"
		><path d="M0,0 L0,8 L8,8" stroke="var(--text-color)" stroke-width="2" fill="none" /></svg
	>
	<svg class="corner"
		><path d="M0,8 L8,8 L8,0" stroke="var(--text-color)" stroke-width="2" fill="none" /></svg
	>
</button>

<style>
	button {
		align-self: center;
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		font-variation-settings: 'wght' 600, 'wdth' 100, 'slnt' 0;
		padding: 9px;
		position: relative;
	}

	button span {
		backdrop-filter: blur(8px);
		border: 2px solid var(--neon-color);
		border-radius: 7px;
		box-shadow: 0 0.5em 2.5em var(--faded-color), 0 0 0.5em var(--neon-color),
			0 0 0.1em var(--neon-color), inset 0 0.5em 1.75em var(--faded-color),
			inset 0 0 0.5em var(--neon-color), inset 0 0 0.1em var(--neon-color);
		color: var(--text-color);
		font-family: var(--font);
		font-size: 1.5em;
		font-variation-settings: 'wght' 600, 'wdth' 100, 'slnt' 0;
		letter-spacing: 0.03em;
		padding: 0.75em 0.85em 0.65em 0.85em;
		transition: ease 250ms;
	}

	button span:hover {
		background: var(--faded-color);
	}

	svg.corner {
		position: absolute;
		overflow: visible; /* makes sure the glow is not cut-off */
		width: 8px;
		height: 8px;
	}

	svg.corner:nth-of-type(1) {
		top: 0;
		left: 0;
	}

	svg.corner:nth-of-type(2) {
		top: 0;
		right: 0;
	}

	svg.corner:nth-of-type(3) {
		bottom: 0;
		left: 0;
	}

	svg.corner:nth-of-type(4) {
		bottom: 0;
		right: 0;
	}
</style>
