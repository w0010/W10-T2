<script>
	import Carousel from '$lib/Carousel.svelte';
	import Flowchart from '$lib/Flowchart.svelte';

	const articles = [
		{
			title: "What's on your mind?",
			content: `Whether you know exactly what you want, or don't have a clue, we begin with a simple phone call. 
        In it, we'll discuss what's on your mind, no commitment necessary. 
        I wish only to help people find their ideal solution, even if that means taking a different direction.`
		},
		{
			title: 'See or even participate in the design',
			content: `Not only will you see the design long before you get tattooed, but many pieces of potential design along the way. 
        I design by process of elimination, leaving no stone unturned.`
		},
		{
			title: 'Collaborate or just watch',
			content: `The design process is digitally simulated over photos of the client, and in person via freehand. 
        The entire process is visible, and you can help guide the outcome.`
		},
		{
			title: 'Local or long distance',
			content: `Designs are constructed over photographs via digital simulation, and in-person via freehand.
        If you're traveling here to get tattooed, we can focus on the digital side of things before you make arrangements to visit.
        That way, we'll have a solid plan before you get here.`
		},
		{
			title: 'Made one with the body',
			content: `The body influences the appearance of the tattoo as much as the tattoo influences the perception of the body.
            For tattoos, that link is inseparable, and so it is one of my highest priorities to make sure they compliment one another.`
		}
	];
</script>

<main>
	<section class="number" data-number="01">
		<h2>Method</h2>
		<Carousel {articles} />
	</section>
	<section class="number" data-number="02">
		<h2>Madness</h2>
		<Flowchart />
	</section>
</main>
