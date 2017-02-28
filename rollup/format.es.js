import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';

export default {
	entry: 'src/index.js',
  dest: 'dist/mitt.es.js',
  format: 'es',
	plugins: [
    flow(),
		buble()
	]
};
