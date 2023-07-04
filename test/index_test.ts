import mitt, { Emitter, EventHandlerMap } from '..';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('mitt', () => {
	it('should default export be a function', () => {
		expect(mitt).to.be.a('function');
	});

	it('should accept an optional event handler map', () => {
		expect(() => mitt(new Map())).not.to.throw;
		const map = new Map();
		const a = spy();
		const b = spy();
		map.set('foo', [a, b]);
		const events = mitt<{ foo: undefined }>(map);
		events.emit('foo');
		expect(a).to.have.been.calledOnce;
		expect(b).to.have.been.calledOnce;
	});
});

describe('mitt#', () => {
	const eventType = Symbol('eventType');
	type Events = {
		foo: unknown;
		constructor: unknown;
		FOO: unknown;
		bar: unknown;
		Bar: unknown;
		'baz:bat!': unknown;
		'baz:baT!': unknown;
		Foo: unknown;
		[eventType]: unknown;
	};
	let events: EventHandlerMap<Events>, inst: Emitter<Events>;

	beforeEach(() => {
		events = new Map();
		inst = mitt(events);
	});

	describe('properties', () => {
		it('should expose the event handler map', () => {
			expect(inst).to.have.property('all').that.is.a('map');
		});
	});

	describe('on()', () => {
		it('should be a function', () => {
			expect(inst).to.have.property('on').that.is.a('function');
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

		it('can take symbols for event types', () => {
			const foo = () => {};
			inst.on(eventType, foo);
			expect(events.get(eventType)).to.deep.equal([foo]);
		});

		// Adding the same listener multiple times should register it multiple times.
		// See https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
		it('should add duplicate listeners', () => {
			const foo = () => {};
			inst.on('foo', foo);
			inst.on('foo', foo);
			expect(events.get('foo')).to.deep.equal([foo, foo]);
		});
	});

	describe('off()', () => {
		it('should be a function', () => {
			expect(inst).to.have.property('off').that.is.a('function');
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

		it('should remove only the first matching listener', () => {
			const foo = () => {};
			inst.on('foo', foo);
			inst.on('foo', foo);
			inst.off('foo', foo);
			expect(events.get('foo')).to.deep.equal([foo]);
			inst.off('foo', foo);
			expect(events.get('foo')).to.deep.equal([]);
		});

		it('off("type") should remove all handlers of the given type', () => {
			inst.on('foo', () => {});
			inst.on('foo', () => {});
			inst.on('bar', () => {});
			inst.off('foo');
			expect(events.get('foo')).to.deep.equal([]);
			expect(events.get('bar')).to.have.length(1);
			inst.off('bar');
			expect(events.get('bar')).to.deep.equal([]);
		});
	});

	describe('emit()', () => {
		it('should be a function', () => {
			expect(inst).to.have.property('emit').that.is.a('function');
		});

		it('should invoke handler for type', () => {
			const event = { a: 'b' };

			inst.on('foo', (one, two?: unknown) => {
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
			star.resetHistory();

			inst.emit('bar', eb);
			expect(star).to.have.been.calledOnce.and.calledWith('bar', eb);
		});
	});
});
