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
});
