export function pauseOthers(node: HTMLElement) {
    node.addEventListener('play', () => {
        document.querySelectorAll('video').forEach(otherVideo => {
            if (otherVideo !== node) {
                otherVideo.pause();
            }
        });
    });

    return {
        destroy() {
            // Clean up if needed
        }
    };
}
