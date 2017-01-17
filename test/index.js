import mitt from '../src';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

it('should default export be a function', () => {
	expect(mitt).to.be.a('function');
});

describe('mitt#', () => {
	let events, inst;

	beforeEach( () => {
		inst = mitt();
		events = inst.all;
	});

	describe('on()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('on')
				.that.is.a('function');
		});

		it('should register handler for new type', () => {
			let foo = () => {};
			inst.on('foo', foo);

			expect(events).to.have.property('foo').that.deep.equals(new Set([foo]));
		});

		it('should register handlers for any type strings', () => {
			let foo = () => {};
			inst.on('constructor', foo);

			expect(events).to.have.property('constructor').that.deep.equals(new Set([foo]));
		});

		it('should append handler for existing type', () => {
			let foo = () => {};
			let bar = () => {};
			inst.on('foo', foo);
			inst.on('foo', bar);

			expect(events).to.have.property('foo').that.deep.equals(new Set([foo, foo, bar]));
		});

		it('should normalize case', () => {
			let foo = () => {};
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:baT!', foo);

			expect(events).to.have.property('foo').that.deep.equals(new Set([foo]));
			expect(events).to.have.property('bar').that.deep.equals(new Set([foo]));
			expect(events).to.have.property('baz:bat!').that.deep.equals(new Set([foo]));
		});
	});

	describe('off()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('off')
				.that.is.a('function');
		});

		it('should remove handler for type', () => {
			let foo = () => {};
			inst.on('foo', foo);
			inst.off('foo', foo);

			expect(events).to.have.property('foo').that.is.empty;
		});

		it('should normalize case', () => {
			let foo = () => {};
			inst.on('foo', foo);
			inst.on('bar', foo);
			inst.on('baz:bat!', foo);

			inst.off('FOO', foo);
			inst.off('Bar', foo);
			inst.off('baz:baT!', foo);

			expect(events).to.have.property('foo').that.is.empty;
			expect(events).to.have.property('bar').that.is.empty;
			expect(events).to.have.property('baz:bat!').that.is.empty;
		});
	});

	describe('emit()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('emit')
				.that.is.a('function');
		});

		it('should invoke handler for type', () => {
			let event = { a: 'b' };

			inst.on('foo', (one, two) => {
				expect(one).to.deep.equal(event);
				expect(two).to.be.an('undefined');
			});

			inst.emit('foo', event);
		});

		it('should invoke handler with multiple arguments', () => {
			inst.on('foo', (aaa, bbb, ccc) => {
				expect(aaa).to.be.equal(111);
				expect(bbb).to.be.equal(222);
				expect(ccc).to.be.equal(333);
			});
			inst.emit('foo', 111, 222, 333);
		});

		it('should ignore case', () => {
			let foo = spy(),
				num = 123;
			events.foo = [foo];

			inst.emit('FOO', num);
			inst.emit('Foo', num);

			let args = foo.args[0];

			expect(foo).to.have.been.calledTwice;
			expect(args).to.be.deep.equal([num, undefined, undefined]);
		});

		it('should invoke * handlers', () => {
			let star = spy(),
				aa = 'bb';
			events['*'] = [star];

			inst.emit('foo', aa);
			inst.emit('bar', aa);

			let args1 = star.args[0],
				args2 = star.args[1];

			expect(star).to.have.been.calledTwice;
			expect(args1).to.deep.equal(['foo', aa, undefined, undefined]);
			expect(args2).to.deep.equal(['bar', aa, undefined, undefined]);
		});
	});
});
