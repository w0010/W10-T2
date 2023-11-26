// $lib/scrollStore.ts
import { writable } from 'svelte/store';

const initialScrollState = {
  scrollTop: 0,
  scrolled: false,
  atBottom: false,
  distanceToBottom: 0
};

const createScrollStore = () => {
  const { subscribe, set, update } = writable(initialScrollState);

  const handleScroll = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const tolerance = 1;
    const atBottom = (scrollTop + windowHeight + tolerance) >= documentHeight;
    const distanceToBottom = documentHeight - (scrollTop + windowHeight);

    update(state => ({
      ...state,
      scrollTop,
      atBottom,
      scrolled: scrollTop > 0,
      distanceToBottom
    }));
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize the store with the current scroll position
  }

  return {
    subscribe,
    reset: () => set(initialScrollState)
  };
};

export const scrollStore = createScrollStore();
