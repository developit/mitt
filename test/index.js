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

			expect(events).to.have.property('foo').that.deep.equals([foo]);
		});

		it('should register handlers for any type strings', () => {
			let foo = () => {};
			inst.on('constructor', foo);

			expect(events).to.have.property('constructor').that.deep.equals([foo]);
		});

		it('should append handler for existing type', () => {
			let foo = () => {};
			let bar = () => {};
			inst.on('foo', foo);
			inst.on('foo', bar);

			expect(events).to.have.property('foo').that.deep.equals([foo, bar]);
		});

		it('should NOT normalize case', () => {
			let foo = () => {};
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:baT!', foo);

			expect(events).to.have.property('FOO').that.deep.equals([foo]);
			expect(events).to.not.have.property('foo');
			expect(events).to.have.property('Bar').that.deep.equals([foo]);
			expect(events).to.not.have.property('bar');
			expect(events).to.have.property('baz:baT!').that.deep.equals([foo]);
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
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:bat!', foo);

			inst.off('FOO', foo);
			inst.off('Bar', foo);
			inst.off('baz:baT!', foo);

			expect(events).to.have.property('FOO').that.is.empty;
			expect(events).to.not.have.property('foo');
			expect(events).to.have.property('Bar').that.is.empty;
			expect(events).to.not.have.property('bar');
			expect(events).to.have.property('baz:baT!').that.is.empty;
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

		it('should invoke handler with multiple (max 2) arguments', () => {
			inst.on('foo', (aaa, bbb) => {
				expect(aaa).to.be.equal(111);
				expect(bbb).to.be.equal(222);
			});
			inst.emit('foo', 111, 222);
		});

		it('should NOT ignore case', () => {
			let foo = spy(),
				bar = spy(),
				num = 123;
			events.Foo = [foo];
			events.FOO = [bar];

			inst.emit('FOO', num);
			inst.emit('Foo', num);

			let args1 = foo.args[0];
			let args2 = bar.args[0];

			expect(foo).to.have.been.calledOnce;
			expect(bar).to.have.been.calledOnce;
			expect(args1).to.be.deep.equal([num, undefined]);
			expect(args2).to.be.deep.equal([num, undefined]);
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
			expect(args1).to.deep.equal(['foo', aa, undefined]);
			expect(args2).to.deep.equal(['bar', aa, undefined]);
		});
	});
});
