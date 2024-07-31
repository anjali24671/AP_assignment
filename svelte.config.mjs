import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

export default {
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    adapter: adapter(),
  },
};
