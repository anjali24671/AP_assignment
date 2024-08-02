import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';

export default {
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    adapter: adapter(),
  },
};
