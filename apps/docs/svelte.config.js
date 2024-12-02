import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            '@r/*': './src/lib/registry/*',
            '@utils/*': './src/lib/registry/utils/*',
            '@components/*': './src/lib/registry/*'
        }
    }
};

export default config;
