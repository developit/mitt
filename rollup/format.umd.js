import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import zopfli from 'rollup-plugin-zopfli';
import flow from 'rollup-plugin-flow';

export default {
	entry: 'src/index.js',
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
};
