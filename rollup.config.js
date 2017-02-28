import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import zopfli from 'rollup-plugin-zopfli';
import flow from 'rollup-plugin-flow';

let config = {
	entry: 'src/index.js'
};

if (process.env.BROWSER) {
	config = Object.assign(config, {
		dest: 'dist/mitt.umd.js',
		format: 'umd',
		moduleName: 'mitt',
		useStrict: false,
		sourceMap: true,
		plugins: [
			flow(),
			buble(),
			uglify({ compress: { warnings: false } }),
			zopfli({ options: { numiterations: 1000 } })
		]
	});
} else {
	config = Object.assign(config, {
		plugins: [
			flow(),
			buble({ target: { node: '4' } })
		],
		targets: [
			{ dest: 'dist/mitt.common.js', format: 'cjs' },
			{ dest: 'dist/mitt.es.js', format: 'es' }
		]
	});
}

export default config;
