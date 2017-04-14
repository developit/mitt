import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';

const pkg = require('./package');

export default {
	entry: 'src/index.js',
	useStrict: false,
	sourceMap: true,
	plugins: [
		flow(),
		buble()
	],
	targets: [
		{dest: pkg.main, format: 'cjs'},
		{dest: pkg.module, format: 'es'},
		{dest: pkg['umd:main'], format: 'umd', moduleName: pkg.name}
	]
};
