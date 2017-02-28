import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';

export default {
	entry: 'src/index.js',
  dest: 'dist/mitt.common.js',
  format: 'cjs',
	plugins: [
    flow(),
		buble()
	]
};
