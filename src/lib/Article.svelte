<!-- Article.svelte -->
<script lang="ts">
	export let className: string = '';
</script>

<article class={className}>
	<div class="content">
		<slot name="head" />
		<slot name="body" />
		<div class="action-container">
			<slot name="action" />
		</div>
	</div>
	<div class="media"><slot name="media" /></div>
</article>

<style>
	article {
		display: flex;
		padding-top: var(--header-height);
		padding-left: var(--margin);
		padding-right: var(--margin);
		padding-bottom: var(--header-height);
	}

	article > :is(.content, .media) {
		flex: 1 1;
	}

	:global(.content :is(h2, h3, p, figure, strong)) {
		padding-left: var(--padding);
		padding-right: var(--padding);
	}

	.action-container {
		display: flex;
		align-items: center;
		padding: var(--padding);
	}

	.media {
		align-items: center;
		justify-content: center;
		display: flex;
	}

	:global(.media :is(img, video)) {
		width: 100%;
	}

	@media (max-width: 768px) {
		article {
			flex-direction: column;
		}
		article.flip {
			flex-direction: column-reverse;
		}
	}
</style>
