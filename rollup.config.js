import buble from 'rollup-plugin-buble';
import flow from 'rollup-plugin-flow';

export default {
	useStrict: false,
	plugins: [
    flow(),
		buble()
	]
};
