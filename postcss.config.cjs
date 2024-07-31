// svelte.config.js
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter(),
  }
};
