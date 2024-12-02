import { genStyles } from '@op-svelte/next-svelte';
import path from 'node:path';

genStyles({
    colorFormat: 'oklch',
    outDir: path.resolve(import.meta.dirname, '../src/styles'),
    includeCommonColors: false
});
