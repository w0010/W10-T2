<!-- src/routes/about/+page.svelte -->
<script lang="ts">
    import SkillBar from "$lib/SkillBar.svelte";
</script>

<main>
	<section id="brad-wooten">
		<h2>About</h2>
		<article class="flip-on-mobile">
			<div class="article-content">
				<h3>
					<span>Brad </span><span>Wooten</span>
				</h3>
			</div>
			<div class="article-image">
				<img class="article-image" src="/images/00 Brad Wooten Portrait.jpg" alt="Brad tattooing" />
			</div>
		</article>
	</section>

	<section id="bio" class="number" data-number="BIO">
		<h2>Biography</h2>
		<article>
			<div class="article-content">
				<p>
					I've been drawing for about as long as I have been speaking. In my youth, I focused on
					illustrating anatomy, robotic design, and architecture with various mediums. I initially
					planned to make a career in worldbuilding and game design, and this led me to consider
					tattoos through the lens of character design. As such, I make considerations far beyond
					the immediate project and help develop the client's end game to future-proof the work into
					the context of their "character."
				</p>
				<p>
					In 2007, I began tattooing in New Orleans. 2015, I went to the Gage Academy of Art in
					Seattle under Michael Magrath for figurative sculpture. I have been professionally
					tattooing for over fifteen years now. I find great joy in using procedural techniques with
					computers combined with live observation of the body's natural shape and tendencies to
					achieve novel styles of tattoo design that fit the body's anatomy.
				</p>
			</div>
			<div class="article-content">
				<p>
					The three-dimensionality of tattoos and their living nature put them in an exceedingly
					unique place among other mediums. It can change the body's appearance like sculpting can,
					creating an illusion of angularity or curvature. It can make anew or reclaim the body for
					the client.
				</p>
				<p>
					I hold a core tenet of no compromise to find ideal life-long solutions for clients. Any
					unknowns will be ground to dust in the process of elimination by creating and examining a
					surplus of ideas to ensure no stone is left unturned. The client can participate in the
					design, and I collaborate comfortably.
				</p>
				<p>
					Tattoos can transform people. Honoring this truth is the most critical practice of my
					work, so my policy is to treat each new project as if it were my best work yet.
				</p>
			</div>
		</article>
	</section>

    <section id="experience" class="number" data-number="EXP">
        <h2>Tools to create with</h2>

        <article>

            <div class="article-content">
                <div>
                    <p>Outside of tattooing, this infographic shows my creative interests and what I am comfortable with.</p>
                    <p>Though this chart is just for fun, you can use it to consider how your idea might overlap with mine.</p>
                </div>
            </div>

            <figure class="article-content flex-end">
                <SkillBar knowledge={3} interest={1}> Life drawing </SkillBar>
                <SkillBar knowledge={2} interest={1}> Drafting </SkillBar>
                <SkillBar knowledge={3} interest={1}> Oil painting </SkillBar>
                <SkillBar knowledge={3} interest={3}> Graphic design </SkillBar>
                <SkillBar knowledge={2} interest={3}> Figurative sculpture </SkillBar>
                <SkillBar knowledge={2} interest={3}> Photography </SkillBar>
                <SkillBar knowledge={1} interest={2}> ZBrush </SkillBar>
                <SkillBar knowledge={3} interest={3}> UI / UX design </SkillBar>
                <SkillBar knowledge={1} interest={3}> React </SkillBar>
            </figure>

        </article>
    </section>


</main>

<style>

    #experience figure {
        padding: 0 var(--padding);
    }

	@media (max-width: 768px) {
		#brad-wooten .article-content {
			position: relative;
			top: -48px;
		}
		#brad-wooten .article-image img {
			aspect-ratio: unset;
		}
	}
</style>
