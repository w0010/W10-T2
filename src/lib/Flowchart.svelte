<!-- Flowchart.svelte -->
<script lang="ts">
	import { Svelvet, Node, Anchor, Edge } from 'svelvet';
	import CustomEdge from '$lib/flowchart/CustomEdge.svelte';
</script>

<Svelvet height={1600} translation={{ x: 400, y: 48 }} fixedZoom disableSelection locked>

	<Node id="start" position={{ x: -200, y: 0 }} dynamic connections={['consu']}>
		<article>
			<div class="node-content">
				<h4>Start</h4>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="consu" position={{ x: 0, y: 200 }} dynamic connections={['silho']}>
		<article>
			<Anchor input />
			<div class="node-content">
				<h4>Consultation</h4>
				<p>Goals and reference exchange.</p>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="silho" position={{ x: 0, y: 375 }} dynamic connections={['sil01', 'sil02', 'sil03']}>
		<article>
			<Anchor input />
			<div class="node-content">
				<h4>Silhouette</h4>
				<p>
					A ratio of darkness is decided, and raw compositions are explored over a photo or directly
					onto the body with a marker. The goal is to use very simple shapes to establish flow and
					to explore all possibilities. This is the equivalent of gesture drawing, the critical
					first step to an energetic finished work. It is rough, and raw.
				</p>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="sil01" position={{ x: -200, y: 620 }} dynamic>
		<article>
			<Anchor input />
			<div class="node-content document">
				<h4>Silhouette 01</h4>
			</div>
		</article>
	</Node>

	<Node id="sil02" position={{ x: 0, y: 620 }} dynamic connections={['rendr']}>
		<article>
			<Anchor id="consu-in" input direction="north" />
			<div class="node-content document">
				<h4>Silhouette 02</h4>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="sil03" position={{ x: 200, y: 620 }} dynamic>
		<article>
			<Anchor id="consu-in" input direction="north" />
			<div class="node-content document">
				<h4>Silhouette 03</h4>
			</div>
		</article>
	</Node>

	<Node id="rendr" position={{ x: 0, y: 875 }} dynamic connections={['variA', 'variB']}>
		<article>
			<Anchor input />
			<div class="node-content">
				<h4>Render A</h4>
				<p>
					After finding a dominant flow, the design is brought to life either as a draft or a final
					design that can be tattooed/ Precise drawing, pattern sampling, and value painting takes
					place here.
				</p>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="variA" position={{ x: -100, y: 1125 }} dynamic>
		<article>
			<Anchor input />
			<div class="node-content document">
				<h4>Varient A</h4>
			</div>
		</article>
	</Node>

	<Node id="variB" position={{ x: 100, y: 1125 }} dynamic connections={['stenc']}>
		<article>
			<Anchor input />
			<div class="node-content document">
				<h4>Varient B</h4>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="stenc" position={{ x: -100, y: 1350 }} dynamic>
		<article>
			<Anchor input />
			<Anchor input />
			<div class="node-content document">
				<h4>Stencil</h4>
			</div>
			<Anchor output />
		</article>
	</Node>

	<Node id="fit" position={{ x: 100, y: 1350 }} dynamic connections={['stenc']}>
		<article>
			<div class="node-content">
				<h4>Fitment</h4>
				<p>Design is brought to the skin to test for fitment and overall impression.</p>
			</div>
			<Anchor output />
		</article>
	</Node>

</Svelvet>

<style>
	:root {
		--anchor-border-width: 0;
		--anchor-width: 6px;
		--anchor-height: 6px;
		--anchor-color: var(--bg-color);
		--node-shadow: 0;
	}

	.document {
		aspect-ratio: 1 / 1;
	}

	article {
		align-items: center;
		backdrop-filter: blur(8px);
		background: none;
		border: 1px solid var(--text-color);
		color: var(--text-color);
		margin: 0;
		max-width: 600px;
		position: relative;
	}

	article > .node-content {
		display: flex;
		flex-direction: column;
		gap: 1.2em;
		padding: calc(var(--padding) * 0.9) var(--padding);
	}

	article > .node-content > :is(h4, p) {
		margin: 0;
		line-height: 1.5em;
	}
</style>
