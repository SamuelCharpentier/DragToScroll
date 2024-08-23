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

	describe('scroll', () => {
		it('scroll with drag event', async () => {
			instance = new DragToScroll(element);

			const delta = { x: -100, y: -100 };

			await dragElement(element, instance, {
				duration: 10,
				steps: 2,
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
				duration: 10,
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
				duration: 10,
			});

			expect(element.scrollTop).toBe(
				scroll.height - clientSize.height,
			);
		});
	});
});
