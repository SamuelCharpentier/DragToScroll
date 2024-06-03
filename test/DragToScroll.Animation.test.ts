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
});
