<!-- Carousel.svelte -->
<script lang="ts">
	let currentSlide = 0;

	type Article = {
		title: string;
		content: string;
	};

	export let articles: Article[] = []; // Passed from parent component

	const nextSlide = () => (currentSlide = (currentSlide + 1) % articles.length);
	const prevSlide = () => (currentSlide = (currentSlide - 1 + articles.length) % articles.length);

	$: carouselInnerStyle = `
		display: flex;
		width: calc(100% * ${articles.length});
		transform: translateX(-${currentSlide * (100 / articles.length)}%);
		transition: transform 0.5s ease;
	`;
</script>

<div class="carousel">
	<div class="carousel-inner" style={carouselInnerStyle}>
		{#each articles as article, index}
			<article class="slide" style="width: {100 / articles.length}%;">
                <div class="article-content">
                    <h3>{article.title}</h3>
                    <p>{article.content}</p>
                </div>
			</article>
		{/each}
	</div>

	<button on:click={prevSlide} class="prev">&lt; prev</button>
	<button on:click={nextSlide} class="next">next &gt;</button>
</div>

<style>
	/* Carousel.css */
	.carousel {
		overflow: hidden;
		padding-bottom: calc(1.5em + 32px);
	}

	.slide {
		flex-shrink: 0;
	}

	.slide :is(h3, p) {
		margin: 0 var(--margin);
	}

	button.prev,
	button.next {
		all: unset;
		bottom: var(--header-height);
		color: var(--text-color);
		cursor: pointer;
		font-size: 1.5em;
		font-variation-settings: 'wght' 100, 'wdth' 100, 'slnt' -10;
		padding: 6px var(--padding);
		position: absolute;
		z-index: 10;
	}

	button.prev {
		border-left: 1px solid var(--text-color);
		left: var(--margin);
	}

	button.next {
		border-right: 1px solid var(--text-color);
		right: var(--margin);
	}
</style>
