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
});
