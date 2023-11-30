<footer>
	<h2>Contact</h2>
	<abbr title="Wooten Tattoo">W10-T2 <span>Tech-Noir Biomechanica</span></abbr>
	<div class="foot">
		<div class="question"><p>Have a tattoo in mind?</p></div>
		<div class="answer"><button data-tf-popup="Ov6ioB7j">Contact</button></div>
		<script src="//embed.typeform.com/next/embed.js"></script> 
	</div>
	<div class="shokunin">職人気質</div>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--header-height));
	}

	footer > :is(abbr, h2) {
		margin-left: var(--margin);
		margin-right: var(--margin);
		padding-left: var(--padding);
		padding-right: var(--padding);
	}

	footer abbr {
		font-size: 2.5em;
		font-variation-settings: 'wght' 900, 'wdth' 200, 'slnt' 0;
		text-decoration: none;
	}
	
	footer abbr span {
		display: block;
		font-size: 12px;
		font-variation-settings: 'wght' 500, 'wdth' 100, 'slnt' 0;
		letter-spacing: 0.42vw;
		text-transform: uppercase;
	}
	
	.foot {
		display: flex;
		flex-direction: column-reverse;
		flex-grow: 1;
		position: relative;
	}

	.question {
		--bevel: 2.65rem;
		background: var(--bg-color2);
		clip-path: polygon(
			0% 0%,
			30% 0%,
			calc(30% + var(--bevel)) var(--bevel),
			calc(70% - var(--bevel)) var(--bevel),
			70% 0%,
			100% 0%,
			100% 100%,
			0% 100%
		);
		padding-top: 5vh;
		padding-bottom: 1vh;
		text-align: center;
	}	.question p {
		font-variation-settings: 'wght' 600, 'slnt' -10;
		padding: 0;
	}
	
	.answer {
		align-items: center;
		display: flex;
		justify-content: center;
		height: 100%;
	}

	.answer button {
		background: none;
		border: none;
		color: var(--text-color);
		font-family: var(--font);
		font-size: calc(12px + 5vmin);
		font-variation-settings: 'wght' 800, 'wdth' 100, 'slnt' 0;
		letter-spacing: 0.02em;
		padding: 12px;
		text-transform: uppercase;
		transition: font-variation-settings 333ms ease-in-out;
	}
	
	.answer button:hover {
		cursor: pointer;
		font-variation-settings: 'wght' 900, 'wdth' 200, 'slnt' -10;
		transition: font-variation-settings 333ms ease-in-out;
	}

	.shokunin {
		background-color: var(--bg-color2);
		border-top: 1px dotted var(--text-color);
		color: var(--text-color);
		font-size: 12px;
		letter-spacing: 0.12em;
		padding-top: 8px;
		padding-bottom: 11px;
		margin: 0;
		text-align: center;
	}
</style>
