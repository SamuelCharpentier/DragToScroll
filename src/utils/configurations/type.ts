import { DeepPartial } from '../lib/deepPartialType';

export type Direction = {
	x: boolean;
	y: boolean;
};

export type AnimationTiming = {
	duration: number;
	easingFactor: number;
	maxSpeed: number;
};

export type AnimationParameters = {
	timing: AnimationTiming;
	slide: boolean;
	// bounce: boolean; ///TODO implement bounce
	// overscroll: boolean; ///TODO implement overscroll
};

export type DragToScrollParameters = {
	direction: Direction;
	animation: AnimationParameters;
	preventDefault: boolean;
	stopPropagation: boolean;
};

export type DragToScrollConfigurations =
	DeepPartial<DragToScrollParameters>;
