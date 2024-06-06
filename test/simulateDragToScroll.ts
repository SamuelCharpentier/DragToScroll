// ignore file coverage
import { fireEvent } from '@testing-library/dom';
import {
	DragToScroll,
	DragToScrollConfigurations,
} from '../src';
import { sleep } from './sleep';

export async function dragElement(
	element: HTMLElement,
	instance: DragToScroll,
	{
		steps = 2,
		duration = 50,
		from = { x: 100, y: 100 },
		delta = { x: -100, y: -100 },
		customFunctionbetweenSteps = () => {},
	}: {
		steps?: number;
		duration?: number;
		from?: { x: number; y: number };
		delta?: { x: number; y: number };
		customFunctionbetweenSteps?: (
			element: HTMLElement,
			instance: DragToScroll,
			stepIndex: number,
		) => void;
	},
) {
	const to = {
		x: from.x + delta.x,
		y: from.y + delta.y,
	};
	const step = {
		x: (to.x - from.x) / steps,
		y: (to.y - from.y) / steps,
	};

	const current = {
		clientX: from.x,
		clientY: from.y,
	};

	fireEvent.mouseDown(element, current);
	fireEvent.mouseMove(window, current);

	for (let i = 0; i < steps; i++) {
		customFunctionbetweenSteps(element, instance, i);
		current.clientX += step.x;
		current.clientY += step.y;
		await sleep(duration / steps);
		fireEvent.mouseMove(window, current);
	}

	fireEvent.mouseUp(window);
}

export async function slideElement(
	element: HTMLElement,
	configurations: DragToScrollConfigurations = {},
	delta: { x: number; y: number },
	scrollToSpy: jest.SpyInstance,
	runBeforeSlide: (
		instance: DragToScroll,
	) => any = () => {},
): Promise<{
	instance: DragToScroll;
	stopSlideAnimationSpy: jest.SpyInstance;
}> {
	let instance = new DragToScroll(element, {
		...configurations,
		animation: {
			...configurations?.animation,
			timing: {
				...configurations.animation?.timing,
				duration: 100,
			},
		},
	});

	let stopSlideAnimationSpy: jest.SpyInstance =
		jest.spyOn(instance as any, 'stopSlideAnimation');

	await dragElement(element, instance, {
		delta,
	});

	stopSlideAnimationSpy.mockClear();
	scrollToSpy.mockClear();
	await runBeforeSlide(instance);
	await sleep(100);
	return { instance, stopSlideAnimationSpy };
}
