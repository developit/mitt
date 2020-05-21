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
		events = new Map();
		inst = mitt(events);
	});

	describe('on()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('on')
				.that.is.a('function');
		});

		it('should register handler for new type', () => {
			const foo = () => {};
			inst.on('foo', foo);

			expect(events.get('foo')).to.deep.equal([foo]);
		});

		it('should register handlers for any type strings', () => {
			const foo = () => {};
			inst.on('constructor', foo);

			expect(events.get('constructor')).to.deep.equal([foo]);
		});

		it('should append handler for existing type', () => {
			const foo = () => {};
			const bar = () => {};
			inst.on('foo', foo);
			inst.on('foo', bar);

			expect(events.get('foo')).to.deep.equal([foo, bar]);
		});

		it('should NOT normalize case', () => {
			const foo = () => {};
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:baT!', foo);

			expect(events.get('FOO')).to.deep.equal([foo]);
			expect(events.has('foo')).to.equal(false);
			expect(events.get('Bar')).to.deep.equal([foo]);
			expect(events.has('bar')).to.equal(false);
			expect(events.get('baz:baT!')).to.deep.equal([foo]);
		});
	});

	describe('off()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('off')
				.that.is.a('function');
		});

		it('should remove handler for type', () => {
			const foo = () => {};
			inst.on('foo', foo);
			inst.off('foo', foo);

			expect(events.get('foo')).to.be.empty;
		});

		it('should NOT normalize case', () => {
			const foo = () => {};
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:bat!', foo);

			inst.off('FOO', foo);
			inst.off('Bar', foo);
			inst.off('baz:baT!', foo);

			expect(events.get('FOO')).to.be.empty;
			expect(events.has('foo')).to.equal(false);
			expect(events.get('Bar')).to.be.empty;
			expect(events.has('bar')).to.equal(false);
			expect(events.get('baz:bat!')).to.have.lengthOf(1);
		});
	});

	describe('emit()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('emit')
				.that.is.a('function');
		});

		it('should invoke handler for type', () => {
			const event = { a: 'b' };

			inst.on('foo', (one, two) => {
				expect(one).to.deep.equal(event);
				expect(two).to.be.an('undefined');
			});

			inst.emit('foo', event);
		});

		it('should NOT ignore case', () => {
			const onFoo = spy(),
				onFOO = spy();
			events.set('Foo', [onFoo]);
			events.set('FOO', [onFOO]);

			inst.emit('Foo', 'Foo arg');
			inst.emit('FOO', 'FOO arg');

			expect(onFoo).to.have.been.calledOnce.and.calledWith('Foo arg');
			expect(onFOO).to.have.been.calledOnce.and.calledWith('FOO arg');
		});

		it('should invoke * handlers', () => {
			const star = spy(),
				ea = { a: 'a' },
				eb = { b: 'b' };

			events.set('*', [star]);

			inst.emit('foo', ea);
			expect(star).to.have.been.calledOnce.and.calledWith('foo', ea);
			star.reset();

			inst.emit('bar', eb);
			expect(star).to.have.been.calledOnce.and.calledWith('bar', eb);
		});
	});
});
