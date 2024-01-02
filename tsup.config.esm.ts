import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		mitt: 'src/index.ts'
	},
	format: 'esm',
	outDir: 'dist/esm',
	dts: true,
	tsconfig: './tsconfig.esm.json',
	target: 'safari11',
	splitting: false,
	sourcemap: true,
	clean: true
});
