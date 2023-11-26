<!-- Header.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { theme } from '$lib/theme';

	let menuOpen = false;
	let burgerMenu: HTMLElement;
	let currentTheme: string;
	let lastScrollTop = 0;
	let hideHeader = false;
	let scrolled = false;
	let unsubscribe: () => void;
	let resizeObserver: ResizeObserver;

	function toggleTheme() {
		theme.update((current) => (current === 'light' ? 'dark' : 'light'))
	}
	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	function closeMenu() {
		menuOpen = false;
	}
	function handleClickOutside(event: MouseEvent) {
		if (burgerMenu && !burgerMenu.contains(event.target as Node)) {
			setTimeout(closeMenu, 10); // timeout ensures that link is followed before menu is closed
		}
	}
	function handleScroll() {
		const currentScrollTop = window.scrollY;
		const documentHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const tolerance = 1; // sometimes there's a <1px descrepency between the doc+win height and scroll
		const atBottom = (currentScrollTop + windowHeight + tolerance) >= documentHeight;

		scrolled = currentScrollTop > 0;
		if (!menuOpen) {
			hideHeader = currentScrollTop > lastScrollTop && !atBottom;
		}
		lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
	}

	onMount(() => {
		if (browser) {
			unsubscribe = theme.subscribe((value) => {
				currentTheme = value;
			});

			window.addEventListener('scroll', handleScroll);
			document.addEventListener('mousedown', handleClickOutside);

			// checks to make sure bottom of page is up to date in locations with dynamic content
			resizeObserver = new ResizeObserver((entries) => {
				for (let entry of entries) {
					handleScroll();
				}
			});

			resizeObserver.observe(document.body); // begin oberservation
			handleScroll(); // init check for scroll position
		}
	});

	onDestroy(() => {
		if (typeof unsubscribe === 'function') {
			unsubscribe();
		}

		if (browser) {
			window.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mousedown', handleClickOutside);

			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		}
	});
</script>





<header class:scrolled class:hide={hideHeader} class:menu-open={menuOpen}>
	<div class="title">
		<a href="/"><h1>Wooten <span>Tattoo</span></h1></a>
	</div>

	<nav>
		<ul class="desktop">
			<li><a href="/portfolio">Portfolio</a></li>
			<li><a href="/about">About</a></li>
			<li><a href="/workflow">Workflow</a></li>
			<li><a href="/appointments">Appointments</a></li>
		</ul>
		<button class="theme-switch" class:dark={currentTheme === 'dark'} on:click={toggleTheme} />
		<button class="burger" on:click={toggleMenu} bind:this={burgerMenu}>
			{menuOpen ? '✖' : '☰'}
		</button>
		<ul class="mobile" class:open={menuOpen}>
			<li><a href="/portfolio">Portfolio</a></li>
			<li><a href="/about">About</a></li>
			<li><a href="/workflow">Workflow</a></li>
			<li><a href="/appointments">Appointments</a></li>
		</ul>
	</nav>
</header>







<style>
	.burger {
		background: none;
		border: none;
		color: var(--text-color);
		display: none;
		font-size: 2rem;
		padding: 0;
		position: relative;
		top: -2px;
		width: 2rem;
		z-index: 9;
	}

	header {
		align-items: center;
		display: flex;
		justify-content: space-between;
		padding: 0 var(--margin);
		position: fixed;
		transition: 0.35s;
		width: 100%;
		height: var(--header-height);
		background: none;
		z-index: 99;
		transform: translateY(0);
		transition: transform 0.2s ease-in-out;
	}

	header.hide:not(.menu-open) {
		transform: translateY(-100%);
	}

	header::before {
		--bevel: 1.5rem;
		background: var(--bg-color2);
		clip-path: polygon(
			0% 0%,
			100% 0%,
			100% 100%,
			70% 100%,
			calc(68% - var(--bevel)) calc(100% - var(--bevel)),
			calc(32% + var(--bevel)) calc(100% - var(--bevel)),
			30% 100%,
			0% 100%
		);
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		transition: opacity 0.2s, visibility 0.2s;
		opacity: 0;
		visibility: hidden;
	}

	header.scrolled:not(.hide)::before {
		opacity: 1;
		visibility: visible;
	}

	.desktop {
		display: flex;
		justify-content: flex-end;
		gap: 26px;
	}

	.desktop a {
		font-variation-settings: 'wght' 500, 'wdth' 100, 'slnt' 0;
		letter-spacing: 0.05em;
	}

	.mobile {
		background: var(--bg-color2);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 32px;
		opacity: 0;
		padding-top: 128px;
		padding-right: calc(var(--margin) + var(--padding));
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100vh;
		visibility: hidden;
		transition: opacity ease 0.3s, visibility ease 0.3s;
		z-index: 1;
	}

	.mobile a {
		border-bottom: 1px solid var(--text-color);
		font-size: 1.2rem;
		font-variation-settings: 'wght' 600, 'wdth' 150, 'slnt' 0;
		padding: 0 0 0.5rem 1rem;
		text-transform: lowercase;
	}

	.mobile.open {
		opacity: 1;
		visibility: visible;
	}

	nav {
		align-items: center;
		display: flex;
		gap: 26px;
	}

	.theme-switch {
		all: unset;
		background: var(--grey);
		border-radius: 12px;
		cursor: pointer;
		height: 24px;
		position: relative;
		width: 40px;
	}

	.theme-switch::before {
		background: var(--bg-color);
		border-radius: 50%;
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		top: 4px;
		left: 4px;
		transition: 0.4s;
	}

	.theme-switch.dark::before {
		left: 20px;
	}

	@media (max-width: 1440px) {
		.desktop a {
			font-variation-settings: 'wght' 500, 'wdth' 80, 'slnt' 0;
		}
	}
	@media (max-width: 768px) {
		.burger {
			display: block;
		}
		.desktop {
			display: none;
		}
	}
</style>
