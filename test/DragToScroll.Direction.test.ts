/**
 * @jest-environment jsdom
 */

import { DragToScroll } from '../src/index';
import { dragElement } from './simulateDragToScroll';
import { createScrollableElement } from './createScrollableElement';

describe('DragToScroll', () => {
	let element: HTMLElement;
	let instance: DragToScroll<HTMLElement>;
	let scrollToSpy: jest.SpyInstance;
	let mouseDownEvent: MouseEvent;

	beforeEach(() => {
		element = createScrollableElement();
		scrollToSpy = jest.spyOn(element, 'scrollTo');
		mouseDownEvent = new MouseEvent('mousedown');
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
					duration: 10,
					steps: 2,
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
});
