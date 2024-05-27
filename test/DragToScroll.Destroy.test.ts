import { DragToScroll } from '../src/index';
import { createScrollableElement } from './createScrollableElement';

describe('DragToScroll', () => {
	let element: HTMLElement;
	let instance: DragToScroll;
	let scrollToSpy: jest.SpyInstance;
	let mouseDownEvent: MouseEvent;

	beforeEach(() => {
		element = createScrollableElement();
		scrollToSpy = jest.spyOn(element, 'scrollTo');
		mouseDownEvent = new MouseEvent('mousedown');
	});
	describe('destroy', () => {
		it('destroys itself if called from instance', () => {
			expect(DragToScroll.instances).toStrictEqual(
				[],
			);

			const instance = new DragToScroll(element);

			expect(DragToScroll.instances).toContain(
				instance,
			);

			const windowRemoveEventListenerSpy = jest.spyOn(
				window,
				'removeEventListener',
			);
			const elementRemoveEventListenerSpy =
				jest.spyOn(element, 'removeEventListener');

			instance.destroy();

			expect(
				windowRemoveEventListenerSpy,
			).toHaveBeenCalled();
			expect(
				elementRemoveEventListenerSpy,
			).toHaveBeenCalled();
			console.log(DragToScroll);
			expect(DragToScroll.instances).not.toContain(
				instance,
			);
		});
		it('destroys the instance from HTML element if called from class', () => {
			expect(DragToScroll.instances).toStrictEqual(
				[],
			);
			const instance = new DragToScroll(element);

			const destroySpy = jest.spyOn(
				instance,
				'destroy',
			);

			expect(
				DragToScroll.instances,
			).not.toStrictEqual([]);

			DragToScroll.destroy(element);

			expect(DragToScroll.instances).toStrictEqual(
				[],
			);
			expect(destroySpy).toHaveBeenCalled();
		});
		it('destroys all instances if called from class', () => {
			expect(DragToScroll.instances).toStrictEqual(
				[],
			);
			const instance1 = new DragToScroll(element);
			const instance2 = new DragToScroll(element);

			const destroySpy1 = jest.spyOn(
				instance1,
				'destroy',
			);
			const destroySpy2 = jest.spyOn(
				instance2,
				'destroy',
			);

			expect(DragToScroll.instances).toStrictEqual([
				instance1,
				instance2,
			]);

			DragToScroll.destroyAll();

			expect(DragToScroll.instances).toStrictEqual(
				[],
			);
			expect(destroySpy1).toHaveBeenCalled();
			expect(destroySpy2).toHaveBeenCalled();
		});
	});
});
