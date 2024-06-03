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
});
