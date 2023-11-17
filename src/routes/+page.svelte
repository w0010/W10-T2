<script lang="ts">
	import Button from '$lib/Button.svelte';
	import FeaturedWork from '$lib/FeaturedWork.svelte';
	import { pauseOthers } from '$lib/pauseOthers';
	import Article from '$lib/Article.svelte';
</script>

<main>
	<Article className="flip">
		<h3 slot="head">Hello!</h3>
		<p slot="body">paragraoh.</p>
		<Button slot="action">button</Button>

		<video slot="media" use:pauseOthers controls loop>
			<source src="/hero-vertical.mp4" type="video/mp4" />
			<track kind="captions" src="/music-only.vtt" label="English" srclang="en" />
		</video>
	</Article>


	<section>
		<article>
			<div>
				<video use:pauseOthers controls loop>
					<source src="/hero-vertical.mp4" type="video/mp4" />
					<track kind="captions" src="/music-only.vtt" label="English" srclang="en" />
				</video>
			</div>
			<div>
				<div>
					<strong>Procedural</strong>
					<strong>Cyberpunk</strong>
					<strong>Blackout</strong>
				</div>
				<span>
					<Button tfPopup="Ov6ioB7j">Make contact</Button>
					<script src="//embed.typeform.com/next/embed.js"></script>
				</span>
			</div>
		</article>
	</section>

	<Article className="flip">
		<h2 slot="head">Process</h2>
		<p slot="body">
			I use tailored measurements, live video design & recording, and optional collaboration to
			develop a transformative tattoo that speaks to you.
		</p>
		<a href="/workflow" slot="action">See workflow &gt;&gt;</a>
		<video use:pauseOthers controls slot="media">
			<source src="/process-intro.mp4" type="video/mp4" />
			<track kind="captions" src="/music-only.vtt" label="English" srclang="en" />
		</video>
	</Article>


	<section>
		<article class="flip-on-mobile">
			<div class="article-content">
				<h2>Process</h2>
				<p>
					I use tailored measurements, live video design & recording, and optional collaboration to
					develop a transformative tattoo that speaks to you.
				</p>
				<span>
					<a href="/workflow">See workflow &gt;&gt;</a>
				</span>
			</div>
			<div class="article-image">
				<video use:pauseOthers controls>
					<source src="/process-intro.mp4" type="video/mp4" />
					<track kind="captions" src="/music-only.vtt" label="English" srclang="en" />
				</video>
			</div>
		</article>
	</section>

	<section>
		<h2>Featured work</h2>
		<FeaturedWork />
	</section>
</main>
