import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		mitt: 'src/index.ts'
	},
	format: 'cjs',
	outDir: 'dist/cjs',
	dts: true,
	tsconfig: './tsconfig.cjs.json',
	target: 'safari11',
	splitting: true,
	sourcemap: true,
	cjsInterop: true,
	clean: true
});
