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
 /* this seems it can't reach h2 to adjust it's padding; out of scope */
	article :is(h2, h3, p, figure, strong) {
		padding-left: var(--padding);
		padding-right: var(--padding);
	}

    .content .action-container {
		display: flex;
        align-items: center;
		justify-content: center;
		flex-grow: 1;
		padding: var(--padding);
		width: 100%;
	}
	
    .media {
		justify-content: center;
		display: flex;
    }

	@media (max-width: 768px) {
		article {
			flex-direction: column;
		}

		.flip {
			flex-direction: column-reverse;
		}
	}
</style>
