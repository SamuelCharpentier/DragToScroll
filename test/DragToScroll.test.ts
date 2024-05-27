/**
 * @jest-environment jsdom
 */

import { DragToScroll } from '../src/index';
import { fireEvent } from '@testing-library/dom';
import { sleep } from './sleep';
import {
	dragElement,
	slideElement,
} from './simulateDragToScroll';
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

	it('should exist', () => {
		expect(DragToScroll).toBeDefined();
	});

	it('should require an HTML element to create an instance and assign that element to its DOMelement property', () => {
		instance = new DragToScroll(element);
		expect(instance).toBeInstanceOf(DragToScroll);
		expect(instance.DOMelement).toBe(element);
	});

	it('should throw an error if the first argument is not an HTML element', () => {
		expect(() => {
			new DragToScroll({} as any as HTMLElement);
		}).toThrow();
	});

	describe('configurations', () => {
		it('should have default configurations', () => {
			instance = new DragToScroll(element);
			expect(instance.parameters).toEqual({
				direction: {
					x: true,
					y: true,
				},
				animation: {
					timing: {
						duration: 1500,
						easingFactor: 4,
						maxSpeed: 10,
					},
					slide: true,
				},
				preventDefault: true,
				stopPropagation: true,
			});
		});

		it('should accept custom configurations', () => {
			instance = new DragToScroll(element, {
				direction: { x: true, y: false },
				animation: {
					timing: {
						duration: 2000,
						easingFactor: 5,
						maxSpeed: 15,
					},
					slide: false,
				},
				preventDefault: false,
				stopPropagation: false,
			});
			expect(instance.parameters).toEqual({
				direction: {
					x: true,
					y: false,
				},
				animation: {
					timing: {
						duration: 2000,
						easingFactor: 5,
						maxSpeed: 15,
					},
					slide: false,
				},
				preventDefault: false,
				stopPropagation: false,
			});
		});
	});
	describe('stopPropagation', () => {
		beforeEach(() => {
			jest.spyOn(mouseDownEvent, 'stopPropagation');
		});

		const cases: [
			string,
			string,
			{
				stopPropagation: boolean;
				calls: number;
			},
		][] = [
			[
				'stops',
				'by default',
				{ stopPropagation: true, calls: 1 },
			],
			[
				'stops',
				'if set to true',
				{ stopPropagation: true, calls: 1 },
			],
			[
				'does not stop',
				'if set to false',
				{ stopPropagation: false, calls: 0 },
			],
		];

		test.each(cases)(
			'%s propagation %s',
			(
				description,
				value,
				{ stopPropagation, calls },
			) => {
				instance = new DragToScroll(element, {
					stopPropagation,
				});
				fireEvent(element, mouseDownEvent);
				expect(
					mouseDownEvent.stopPropagation,
				).toHaveBeenCalledTimes(calls);
			},
		);
	});

	describe('preventDefault', () => {
		let mouseDownEvent: MouseEvent;
		beforeEach(() => {
			mouseDownEvent = new MouseEvent('mousedown');
			jest.spyOn(mouseDownEvent, 'preventDefault');
		});

		const cases: [
			string,
			string,
			{
				preventDefault: boolean;
				calls: number;
			},
		][] = [
			[
				'prevents',
				'by default',
				{ preventDefault: true, calls: 1 },
			],
			[
				'prevents',
				'if set to true',
				{ preventDefault: true, calls: 1 },
			],
			[
				'does not prevent',
				'if set to false',
				{ preventDefault: false, calls: 0 },
			],
		];

		test.each(cases)(
			'%s default behavior %s',
			(
				description,
				value,
				{ preventDefault, calls },
			) => {
				instance = new DragToScroll(element, {
					preventDefault,
				});
				fireEvent(element, mouseDownEvent);
				expect(
					mouseDownEvent.preventDefault,
				).toHaveBeenCalledTimes(calls);
			},
		);
	});

	describe('direction', () => {
		const delta = { x: -100, y: -100 };
		const cases: [
			string,
			string,
			{
				configurations?: {
					direction?: {
						x?: boolean;
						y?: boolean;
					};
				};
				expectedDirection: {
					x: boolean;
					y: boolean;
				};
				expectedScroll: { x: number; y: number };
				description?: {
					direction: string;
					value: string;
				};
			},
		][] = [
			[
				'in both',
				'by default',
				{
					configurations: undefined,
					expectedDirection: { x: true, y: true },
					expectedScroll: {
						x: delta.x * -1,
						y: delta.y * -1,
					},
				},
			],
			[
				'in both',
				'if not specified',
				{
					configurations: { direction: {} },
					expectedDirection: { x: true, y: true },
					expectedScroll: {
						x: delta.x * -1,
						y: delta.y * -1,
					},
				},
			],
			[
				'in both',
				'if both x and y are set to true',
				{
					configurations: {
						direction: { x: true, y: true },
					},
					expectedDirection: { x: true, y: true },
					expectedScroll: {
						x: delta.x * -1,
						y: delta.y * -1,
					},
				},
			],
			[
				'only in x',
				'if x is set to true',
				{
					configurations: {
						direction: { x: true },
					},
					expectedDirection: {
						x: true,
						y: false,
					},
					expectedScroll: {
						x: delta.x * -1,
						y: 0,
					},
				},
			],
			[
				'only in y',
				'if y is set to true',
				{
					configurations: {
						direction: { y: true },
					},
					expectedDirection: {
						x: false,
						y: true,
					},
					expectedScroll: {
						x: 0,
						y: delta.y * -1,
					},
				},
			],
			[
				'only in y',
				'if x is set to false',
				{
					configurations: {
						direction: { x: false },
					},
					expectedDirection: {
						x: false,
						y: true,
					},
					expectedScroll: {
						x: 0,
						y: delta.y * -1,
					},
				},
			],
			[
				'only in x',
				'if y is set to false',
				{
					configurations: {
						direction: { y: false },
					},
					expectedDirection: {
						x: true,
						y: false,
					},
					expectedScroll: {
						x: delta.x * -1,
						y: 0,
					},
				},
			],
			[
				'in no',
				'direction if x and y set to false',
				{
					configurations: {
						direction: { x: false, y: false },
					},
					expectedDirection: {
						x: false,
						y: false,
					},
					expectedScroll: { x: 0, y: 0 },
				},
			],
		];

		test.each(cases)(
			'it scrolls %s direction %s',
			async (
				descriptionDirection,
				descriptionValue,
				{
					configurations,
					expectedDirection,
					expectedScroll,
				},
			) => {
				instance = new DragToScroll(
					element,
					configurations,
				);
				expect(
					instance.parameters.direction,
				).toEqual(expectedDirection);

				await dragElement(element, instance, {
					delta,
				});

				expect(element.scrollTop).toBe(
					expectedScroll.y,
				);
				expect(element.scrollLeft).toBe(
					expectedScroll.x,
				);
			},
		);
	});

	describe('animation', () => {
		describe('slide', () => {
			let delta = { x: -100, y: -100 };
			let stopSlideAnimationSpy: jest.SpyInstance;

			it('should implement animateSlide', () => {
				expect(
					(DragToScroll as any).prototype
						.animateSlide,
				).toBeDefined();
			});

			it('slide if set to true', async () => {
				const slide = true;

				const { instance } = await slideElement(
					element,
					{ animation: { slide } },
					delta,
					scrollToSpy,
				);

				expect(
					instance.parameters.animation.slide,
				).toBe(slide);

				expect(scrollToSpy).toHaveBeenCalledWith({
					behavior: 'instant',
					left: expect.any(Number),
					top: expect.any(Number),
				});

				expect(element.scrollTop).toBeGreaterThan(
					delta.y * -1,
				);
				expect(element.scrollLeft).toBeGreaterThan(
					delta.x * -1,
				);
			});
			it('does not slide if set to false', async () => {
				const slide = false;

				const { instance } = await slideElement(
					element,
					{ animation: { slide } },
					delta,
					scrollToSpy,
				);

				expect(
					instance.parameters.animation.slide,
				).toBe(slide);

				expect(scrollToSpy).not.toHaveBeenCalled();

				expect(element.scrollTop).toBe(
					delta.y * -1,
				);
				expect(element.scrollLeft).toBe(
					delta.x * -1,
				);
			});

			it('stops on mouse down event on element', async () => {
				const slide = true;

				const { stopSlideAnimationSpy } =
					await slideElement(
						element,
						{ animation: { slide } },
						delta,
						scrollToSpy,
						() => {
							fireEvent.mouseDown(element);
						},
					);

				expect(scrollToSpy).not.toHaveBeenCalled();
				expect(
					stopSlideAnimationSpy,
				).toHaveBeenCalled();
			});

			it('stops on wheel event on element', async () => {
				const slide = true;

				const { stopSlideAnimationSpy } =
					await slideElement(
						element,
						{ animation: { slide } },
						delta,
						scrollToSpy,
						() => {
							fireEvent.wheel(element);
						},
					);

				expect(scrollToSpy).not.toHaveBeenCalled();
				expect(
					stopSlideAnimationSpy,
				).toHaveBeenCalled();
			});

			it('stops if release velocity is set to undefined', async () => {
				const slide = true;

				await slideElement(
					element,
					{ animation: { slide } },
					delta,
					scrollToSpy,
					(instance: DragToScroll) => {
						// edge case
						// illegal access to private property
						// @ts-ignore
						instance.releaseVelocity =
							undefined;
					},
				);

				expect(scrollToSpy).not.toHaveBeenCalled();
			});

			it('stops if slideAnimationData is set to undefined', async () => {
				const slide = true;

				await slideElement(
					element,
					{ animation: { slide } },
					delta,
					scrollToSpy,
					(instance: DragToScroll) => {
						// edge case
						// illegal access to private property
						// @ts-ignore
						instance.slideAnimationData =
							undefined;
					},
				);

				expect(scrollToSpy).not.toHaveBeenCalled();
			});

			it('does not slide if the release velocity is lower than 0.2', async () => {
				const slide = true;
				delta = { x: -10, y: -10 };

				await slideElement(
					element,
					{ animation: { slide } },
					delta,
					scrollToSpy,
				);

				expect(scrollToSpy).not.toHaveBeenCalled();
			});
		});
		describe('bounce', () => {
			test.todo('should implement bounce');
		});

		describe('overscroll', () => {
			test.todo('should implement overscroll');
		});
	});

	describe('scroll', () => {
		it('scroll with drag event', async () => {
			new DragToScroll(element);

			const delta = { x: -100, y: -100 };

			await dragElement(element, instance, {
				delta,
			});

			expect(scrollToSpy).toHaveBeenCalledWith({
				behavior: 'instant',
				left: expect.any(Number),
				top: expect.any(Number),
			});

			expect(element.scrollTop).toBe(delta.y * -1);
			expect(element.scrollLeft).toBe(delta.x * -1);
		});

		it('does not scroll beyond limits', async () => {
			const scroll = {
				width: 1000,
				height: 1000,
				top: 0,
				left: 0,
			};
			const clientSize: {
				width: number;
				height: number;
			} = {
				width: 100,
				height: 100,
			};
			element = createScrollableElement(
				scroll,
				clientSize,
			);

			const instance = new DragToScroll(element);

			let delta = {
				x: (element.scrollWidth + 100) * -1,
				y: 0,
			};

			await dragElement(element, instance, {
				delta,
				steps: 2,
			});

			expect(element.scrollLeft).toBe(
				scroll.width - clientSize.width,
			);

			delta = {
				x: 0,
				y: (element.scrollHeight + 100) * -1,
			};

			await dragElement(element, instance, {
				delta,
				steps: 2,
			});

			expect(element.scrollTop).toBe(
				scroll.height - clientSize.height,
			);
		});
	});

	describe('edge cases', () => {
		it('throws if mouseData is cleared', async () => {
			const instance = new DragToScroll(element);

			const delta = { x: -100, y: -100 };

			const globalErrorListener = jest.fn();

			addEventListener('error', (e) => {
				globalErrorListener(e.message);
			});

			await dragElement(element, instance, {
				steps: 2,
				delta,
				customFunctionbetweenSteps: (
					element: HTMLElement,
					instance: DragToScroll,
					stepIndex: number,
				) => {
					(
						instance as any
					).mouseDataManager.clearMouseData();
				},
			});

			expect(
				globalErrorListener,
			).toHaveBeenCalledWith(
				'prev mouse move is undefined',
			);
		});
		it('throws if mouseData.get function is overridden to return undefined', async () => {
			const instance = new DragToScroll(element);

			// edge case
			// illegal access to protected property
			// @ts-ignore
			instance.mouseData = { get: () => undefined };

			const delta = { x: -100, y: -100 };

			const globalErrorListener = jest.fn();

			addEventListener('error', (e) => {
				globalErrorListener(e.message);
			});

			await dragElement(element, instance, {
				steps: 2,
				delta,
			});

			expect(
				globalErrorListener,
			).toHaveBeenCalledWith(
				'present mouse move is undefined',
			);
		});
	});
	describe('instances', () => {
		it('is defined as a static property array', () => {
			expect(DragToScroll.instances).toBeInstanceOf(
				Array,
			);
		});
		it('contains all instances of DragToScroll', () => {
			DragToScroll.instances = [];
			let instance = new DragToScroll(element);
			expect(DragToScroll.instances).toContain(
				instance,
			);

			const defaultClassElement =
				createScrollableElement();
			defaultClassElement.classList.add(
				'drag-to-scroll',
			);
			document.body.appendChild(defaultClassElement);

			DragToScroll.apply();

			expect(DragToScroll.instances).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						DOMelement: defaultClassElement,
					}),
				]),
			);

			const customClassName = 'custom-drag-to-scroll';
			const customClassElement =
				createScrollableElement();
			customClassElement.classList.add(
				customClassName,
			);
			document.body.appendChild(customClassElement);

			const controlElement =
				createScrollableElement();
			document.body.appendChild(controlElement);

			DragToScroll.apply(customClassName);

			expect(DragToScroll.instances).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						DOMelement: customClassElement,
					}),
				]),
			);
		});
	});
	describe('apply', () => {
		it('should apply the DragToScroll class to all elements with the class name', () => {
			const defaultClassElement =
				createScrollableElement();
			defaultClassElement.classList.add(
				'drag-to-scroll',
			);
			document.body.appendChild(defaultClassElement);

			const customClassElement =
				createScrollableElement();
			customClassElement.classList.add(
				'custom-drag-to-scroll',
			);
			document.body.appendChild(customClassElement);

			const controlElement =
				createScrollableElement();
			document.body.appendChild(controlElement);

			DragToScroll.apply();
		});
	});
	describe('destroy', () => {
		it('should remove the instance from the instances array', () => {
			DragToScroll.instances = [];

			expect(DragToScroll.instances).toStrictEqual(
				[],
			);

			const windowRemoveEventListenerSpy = jest.spyOn(
				window,
				'removeEventListener',
			);
			const elementRemoveEventListenerSpy =
				jest.spyOn(element, 'removeEventListener');

			const instance = new DragToScroll(element);

			expect(DragToScroll.instances).toContain(
				instance,
			);

			instance.destroy();

			expect(
				windowRemoveEventListenerSpy,
			).toHaveBeenCalled();
			expect(
				elementRemoveEventListenerSpy,
			).toHaveBeenCalled();
			expect(DragToScroll.instances).not.toContain(
				instance,
			);
		});
	});
});
