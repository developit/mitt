import mitt from '../src';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);


describe('mitt', () => {
	it('should be a function', () => {
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
				inst.on('foo', foo);
				inst.on('foo', bar);

				expect(events).to.have.property('foo').that.deep.equals([foo, foo, bar]);
			});

			it('should normalize case', () => {
				let foo = () => {};
				inst.on('FOO', foo);
				inst.on('Bar', foo);
				inst.on('baz:baT!', foo);

				expect(events).to.have.property('foo').that.deep.equals([foo]);
				expect(events).to.have.property('bar').that.deep.equals([foo]);
				expect(events).to.have.property('baz:bat!').that.deep.equals([foo]);
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
				events.foo = [foo];
				inst.off('foo', foo);

				expect(events).to.have.property('foo').that.is.empty;
			});

			it('should remove only one handler for dupes', () => {
				let foo = () => {};
				events.foo = [foo, foo];

				inst.off('foo', foo);
				expect(events).to.have.property('foo').that.deep.equals([foo]);

				inst.off('foo', foo);
				expect(events).to.have.property('foo').that.is.empty;
			});

			it('should normalize case', () => {
				let foo = () => {};
				events.foo = [foo];
				events.bar = [foo];
				events['baz:bat!'] = [foo];

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
				let foo = spy(),
					event = {};
				events.foo = [foo];

				inst.emit('foo', event);

				expect(foo)
					.to.have.been.calledOnce
					.and.calledWithExactly(event);
			});

			it('should ignore case', () => {
				let foo = spy(),
					event = {};
				events.foo = [foo];

				inst.emit('FOO', event);
				inst.emit('Foo', event);

				expect(foo)
					.to.have.been.calledTwice
					.and.always.calledWithExactly(event);
			});

			it('should invoke * handlers', () => {
				let star = spy(),
					event = {};
				events['*'] = [star];

				inst.emit('foo', event);
				inst.emit('bar', event);

				expect(star)
					.to.have.been.calledTwice
					.and.always.calledWithExactly(event);
			});
		});
	});
});
