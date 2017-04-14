import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
	entry: 'src/index.js',
	useStrict: false,
	sourceMap: true,
	plugins: [
		flow(),
		buble()
	],
	targets: [
		{ dest: pkg.main, format: 'cjs' },
		{ dest: pkg.module, format: 'es' },
		{ dest: pkg['umd:main'], format: 'umd', moduleName: pkg.name }
	]
};
