import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		mitt: 'src/index.ts'
	},
	format: 'iife',
	outDir: 'dist',
	globalName: 'mitt',
	target: 'safari11',
	splitting: false,
	sourcemap: true,
	clean: true,
	outExtension: () => ({ js: '.umd.js' }),
	footer: () => ({
		js: 'Object.assign(window,{mitt:mitt.default})'
	})
});
