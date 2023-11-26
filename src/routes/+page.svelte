<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FeaturedWork from '$lib/FeaturedWork.svelte';
	import { pauseOthers } from '$lib/pauseOthers';
	import Article from '$lib/Article.svelte';
</script>

<main>
	<section>
		<h2>Styles</h2>
		<strong>Procedural</strong>
		<strong>Cyberpunk</strong>
		<strong>Blackout</strong>
		<Button tfPopup="Ov6ioB7j">Contact</Button>
		<script src="//embed.typeform.com/next/embed. js"></script>

	</section>

	<Article className="flip">
		<h2 slot="head">Process</h2>
		<p slot="body">
			I use tailored measurements, live video design & recording, and optional collaboration to
			develop a transformative tattoo that speaks to you.
		</p>
		<a class="arrow-link" href="/workflow" slot="action">See workflow 🡲</a>
		<video use:pauseOthers controls slot="media">
			<source src="/process-intro.mp4" type="video/mp4" />
			<track kind="captions" src="/music-only.vtt" label="English" srclang="en" />
		</video>
	</Article>

	<section>
		<h2>Featured work</h2>
		<FeaturedWork />
		<a class="arrow-link" href="/portfolio">Full portfolio 🡲</a>
	</section>
</main>

<style>
	.arrow-link {
		color: var(--neon-color);
		font-size: 24px;
		font-variation-settings: 'wght' 300, 'wdth' 150, 'slnt' 0;
		letter-spacing: 0.02rem;
		padding-top: var(--padding);
		text-align: right;
		transition: font-variation-settings 100ms ease-in; /* ease-in for hover-out */
	}
	.arrow-link:hover {
		font-variation-settings: 'wght' 500, 'wdth' 150, 'slnt' -10;
		transition: font-variation-settings 100ms ease-out; /* ease-out for hover-in */

	}
</style>