import { defineConfig } from 'tsup';

export default defineConfig({
	entry: { dragToBlank: 'src/index.ts' },
	platform: 'browser',
	splitting: false,
	dts: true,
	sourcemap: true,
	format: ['iife'],
	clean: true,
	minify: false,
	treeshake: false,
	outDir: './dev/scripts',
	env: {
		NODE_ENV: 'DEV',
	},
	watch: ['src'],
});
