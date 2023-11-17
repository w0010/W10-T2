<script lang="ts">
    export let knowledge: number;
    export let interest: number;
    
    $: width = (knowledge === 3 ? '100%' : knowledge === 2 ? '66.66%' : '33.33%');
    $: opacity = (interest === 3 ? '100%' : interest === 2 ? '66.66%' : '33.33%');
</script>

<div class="skill-bar" style="opacity: {opacity}; width: {width};">
	<slot />
</div>

<style>
    .skill-bar {
        align-items: flex-end; 
        background: var(--text-color);
        color: var(--bg-color); 
        display: flex; 
        font-size: 0.8em; 
        font-variation-settings: 'wght' 500, 'wdth' 100, 'slnt' -10; 
        letter-spacing: 0em; 
        margin: 5px 0; 
        padding: 0.7em 1.8em; 
        white-space: nowrap;
    }
</style>