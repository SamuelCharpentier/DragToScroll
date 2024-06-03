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
});
