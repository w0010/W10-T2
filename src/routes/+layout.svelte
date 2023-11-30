<!-- +layout.svelte -->
<script>
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import Polyspace from '$lib/Polyspace.svelte';
	import { themeAction } from '$lib/theme';
</script>

<div class="theme-provider" use:themeAction>
	<Header />
	<slot />
	<Footer />
	<Polyspace />
</div>

<!-- <style>
	:global(article, footer, section) {
		backdrop-filter: blur(8px);
	}
</style> -->