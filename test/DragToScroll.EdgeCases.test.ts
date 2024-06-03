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

	describe('edge cases', () => {
		it('throws if mouseData is cleared', async () => {
			const instance = new DragToScroll(element);

			const delta = { x: -100, y: -100 };

			const globalErrorListener = jest.fn();

			addEventListener('error', (e) => {
				globalErrorListener(e.message);
			});

			await dragElement(element, instance, {
				duration: 10,
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
				duration: 10,
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
});
