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
		events = Object.create(null);
		inst = mitt(events);
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

		it('should NOT ignore case', () => {
			let onFoo = spy(),
				onFOO = spy();
			events.Foo = [onFoo];
			events.FOO = [onFOO];

			inst.emit('Foo', 'Foo arg');
			inst.emit('FOO', 'FOO arg');

			expect(onFoo).to.have.been.calledOnce.and.calledWith('Foo arg');
			expect(onFOO).to.have.been.calledOnce.and.calledWith('FOO arg');
		});

		it('should invoke * handlers', () => {
			let star = spy(),
				ea = { a: 'a' },
				eb = { b: 'b' };

			events['*'] = [star];

			inst.emit('foo', ea);
			expect(star).to.have.been.calledOnce.and.calledWith('foo', ea);
			star.reset();

			inst.emit('bar', eb);
			expect(star).to.have.been.calledOnce.and.calledWith('bar', eb);
		});
	});
});
