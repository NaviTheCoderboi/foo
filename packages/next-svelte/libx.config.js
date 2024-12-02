import { defineConfig } from '@navithecoderboi/libx';

export default defineConfig((opts) => {
    const dev = opts.watch === undefined ? false : opts.watch;

    return {
        entry: ['./src'],
        clean: true,
        dts: !dev,
        sourcemap: dev,
        platform: 'node',
        tsconfig: './tsconfig.json',
        svelte: true
    };
});
