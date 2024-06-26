import { DragToBlank } from 'drag-to-blank';

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? DeepPartial<U>[]
		: T[P] extends readonly (infer U)[]
		? readonly DeepPartial<U>[]
		: DeepPartial<T[P]>;
};
interface Direction {
	x: boolean;
	y: boolean;
}

interface AnimationTiming {
	duration: number;
	easingFactor: number;
	maxSpeed: number;
}

interface AnimationParameters {
	timing: AnimationTiming;
	slide: boolean;
	// bounce: boolean; ///TODO implement bounce
	// overscroll: boolean; ///TODO implement overscroll
}

interface Velocity {
	speed: number;
	angle: number;
}

interface SlideAnimationData {
	startTimestamp: number;
	timestamp: number;
	rafID: number;
}

export interface DragToScrollConfigurations {
	direction?: Partial<Direction>;
	animation?: DeepPartial<AnimationParameters>;
	preventDefault?: boolean;
	stopPropagation?: boolean;
}

const validateConfigurations = (
	configurations: any,
): configurations is DragToScrollConfigurations => {
	if (configurations.direction !== undefined) {
		if (typeof configurations.direction !== 'object') {
			throw new Error(
				`In your configurations, 'direction' must be an (object) with any of the following properties: x (boolean), y (boolean)`,
			);
		}
		for (const direction of ['x', 'y']) {
			if (
				configurations.direction[direction] !==
					undefined &&
				typeof configurations.direction[
					direction
				] !== 'boolean'
			) {
				throw new Error(
					`In your configurations, 'direction.${direction}' must be a (boolean) when defined, received ${
						configurations.direction[direction]
					}[${typeof configurations.direction[
						direction
					]}]`,
				);
			}
		}
	}
	if (configurations.animation !== undefined) {
		if (typeof configurations.animation !== 'object') {
			throw new Error(
				`In your configurations, 'animation' must be an (object) with any of the following properties: 'timing' (object), 'slide' (boolean)`,
			);
		}
		if (configurations.animation.timing !== undefined) {
			if (
				typeof configurations.animation.timing !==
				'object'
			) {
				throw new Error(
					`In your configurations, 'animation.timing' must be an (object) with any of the following properties: 'duration' (number), 'easingFactor' (number), 'maxSpeed' (number)`,
				);
			}
			const timingProperties = [
				{ name: 'duration', minVal: 0 },
				{ name: 'easingFactor', minVal: 1 },
				{ name: 'maxSpeed', minVal: 0 },
			];
			for (const propertyCase of timingProperties) {
				const property = propertyCase.name;
				if (
					configurations.animation.timing[
						property
					] !== undefined
				) {
					if (
						typeof configurations.animation
							.timing[property] !== 'number'
					) {
						throw new Error(
							`In your configurations, 'animation.timing.${property}' must be a (number) when defined, received ${
								configurations.animation
									.timing[property]
							}[${typeof configurations
								.animation.timing[
								property
							]}]`,
						);
					}
					if (
						configurations.animation.timing[
							property
						] < propertyCase.minVal
					) {
						throw new Error(
							`In your configurations, 'animation.timing.${property}' can't be less than ${
								propertyCase.minVal
							} when defined, received ${
								configurations.animation
									.timing[property]
							}[${typeof configurations
								.animation.timing[
								property
							]}]`,
						);
					}
				}
			}
		}
		if (
			configurations.animation.slide !== undefined &&
			typeof configurations.animation.slide !==
				'boolean'
		) {
			throw new Error(
				`In your configurations, 'animation.slide' must be a (boolean) when defined, received ${
					configurations.animation.slide
				}[${typeof configurations.animation
					.slide}]`,
			);
		}
	}
	if (
		configurations.preventDefault !== undefined &&
		typeof configurations.preventDefault !== 'boolean'
	) {
		throw new Error(
			`In your configurations, 'preventDefault' must be a (boolean) when defined, received ${
				configurations.preventDefault
			}[${typeof configurations.preventDefault}]`,
		);
	}
	if (
		configurations.stopPropagation !== undefined &&
		typeof configurations.stopPropagation !== 'boolean'
	) {
		throw new Error(
			`In your configurations, 'stopPropagation' must be a (boolean) when defined, received ${
				configurations.stopPropagation
			}[${typeof configurations.stopPropagation}]`,
		);
	}
	return true;
};

/**
 * Represents a draggable element with scroll functionality.
 */
export class DragToScroll extends DragToBlank {
	parameters: {
		direction: Direction;
		animation: AnimationParameters;
		preventDefault: boolean;
		stopPropagation: boolean;
	};
	private releaseVelocity?: Velocity;
	private slideAnimationData?: SlideAnimationData;
	protected static override defaultClassName =
		'drag-to-scroll';
	static override instances: DragToScroll[] = [];

	private boundStopSlideAnimation: (event: Event) => void;

	constructor(
		DOMelement: HTMLElement,
		configurations: DragToScrollConfigurations = {},
	) {
		validateConfigurations(configurations);
		super(DOMelement);

		const defaultParameters = {
			direction: { x: true, y: true },
			animation: {
				timing: {
					duration: 1500,
					easingFactor: 4,
					maxSpeed: 10,
				},
				slide: true,
				//bounce: true, ///TODO implement bounce
				//overscroll: true, ///TODO implement overscroll
			},
			preventDefault: true,
			stopPropagation: true,
		};

		const defaultTiming =
			defaultParameters.animation.timing;

		const timingConfigurations =
			configurations.animation?.timing;

		this.parameters = {
			direction: {
				x:
					configurations.direction?.x !==
					undefined
						? configurations.direction.x
						: configurations.direction?.y ===
						  true
						? false
						: defaultParameters.direction.x,
				y:
					configurations.direction?.y !==
					undefined
						? configurations.direction.y
						: configurations.direction?.x ===
						  true
						? false
						: defaultParameters.direction.y,
			},
			animation: {
				timing: {
					duration:
						timingConfigurations?.duration ??
						defaultTiming.duration,
					easingFactor:
						timingConfigurations?.easingFactor ??
						defaultTiming.easingFactor,
					maxSpeed:
						timingConfigurations?.maxSpeed ??
						defaultTiming.maxSpeed,
				},
				slide:
					configurations.animation?.slide ??
					defaultParameters.animation.slide,
				//bounce: config.animationOptions?.bounce ?? defaultParameters.animationOptions.bounce, ///TODO implement bounce
				//overscroll: config.animationOptions?.overscroll ?? defaultParameters.animationOptions.overscroll, ///TODO implement overscroll
			},
			preventDefault:
				configurations.preventDefault ?? true,
			stopPropagation:
				configurations.stopPropagation ?? true,
		};

		this.boundStopSlideAnimation = () =>
			this.stopSlideAnimation();

		DragToScroll.instances.push(this);
	}

	private handleEventChecks(event: MouseEvent): void {
		if (this.parameters.stopPropagation)
			event.stopPropagation();
		if (this.parameters.preventDefault)
			event.preventDefault();
	}

	protected override mouseDown(event: MouseEvent): void {
		this.handleEventChecks(event);
		this.stopSlideAnimation();
	}

	protected override dragMove(event: MouseEvent): void {
		this.handleEventChecks(event);
		const dragMoveData = this.mouseData.get('dragMove');
		if (dragMoveData === undefined)
			throw new Error(
				'present mouse move is undefined',
			);
		if (dragMoveData.prev === undefined)
			throw new Error('prev mouse move is undefined');

		const distanceX: number =
			dragMoveData.position.x -
			dragMoveData.prev.position.x;
		const distanceY: number =
			dragMoveData.position.y -
			dragMoveData.prev.position.y;
		this.scroll({ distanceX, distanceY });
	}

	protected override dragEnd(event: MouseEvent): void {
		this.handleEventChecks(event);
		if (
			this.parameters.animation.slide &&
			this.setReleaseVelocity()
		)
			this.startAnimateSlide();
	}

	private setReleaseVelocity(): boolean {
		const dragMoveData = this.mouseData.get('dragMove');

		if (
			dragMoveData === undefined ||
			dragMoveData.prev === undefined
		)
			return false;

		const timeDif =
			dragMoveData.timestamp -
			dragMoveData.prev.timestamp;

		const deltaX =
			dragMoveData.position.x -
			dragMoveData.prev.position.x;
		const deltaY =
			dragMoveData.position.y -
			dragMoveData.prev.position.y;

		const distance = Math.sqrt(
			Math.pow(deltaX, 2) + Math.pow(deltaY, 2),
		);

		let speed = Math.min(
			distance / timeDif,
			this.parameters.animation.timing.maxSpeed,
		);
		if (speed <= 0.2) return false;

		this.releaseVelocity = {
			speed,
			angle: Math.atan2(deltaY, deltaX),
		};
		return true;
	}

	private startAnimateSlide() {
		this.DOMelement.addEventListener(
			'wheel',
			this.boundStopSlideAnimation,
		);
		this.slideAnimationData = {
			rafID: requestAnimationFrame(
				this.animateSlide.bind(this),
			),
			timestamp: Date.now(),
			startTimestamp: Date.now(),
		};
	}

	private animateSlide(): void {
		if (
			this.releaseVelocity === undefined ||
			this.slideAnimationData === undefined
		)
			return;

		const timestamp = Date.now();

		const timeDifStart =
			timestamp -
			this.slideAnimationData.startTimestamp;

		if (
			timeDifStart <
			this.parameters.animation.timing.duration
		) {
			const timeDifLastFrame =
				timestamp -
				this.slideAnimationData.timestamp;

			const progress =
				(timeDifStart - timeDifLastFrame / 2) /
				this.parameters.animation.timing.duration;

			const easing = this.easeOutProgress(progress);

			const { speed, angle } = this.releaseVelocity;

			const easedSpeedByFrameDuration =
				speed * easing * timeDifLastFrame;

			const distanceX =
				Math.cos(angle) * easedSpeedByFrameDuration;
			const distanceY =
				Math.sin(angle) * easedSpeedByFrameDuration;

			this.scroll({
				distanceX,
				distanceY,
			});
			this.slideAnimationData.timestamp = timestamp;
			this.slideAnimationData.rafID =
				requestAnimationFrame(
					this.animateSlide.bind(this),
				);
		} else {
			this.stopSlideAnimation();
		}
	}

	private easeOutProgress(progress: number) {
		return Math.pow(
			1 - progress,
			this.parameters.animation.timing.easingFactor,
		);
	}

	private stopSlideAnimation(): void {
		this.DOMelement.removeEventListener(
			'wheel',
			this.boundStopSlideAnimation,
		);
		if (this.slideAnimationData !== undefined)
			cancelAnimationFrame(
				this.slideAnimationData.rafID,
			);
		this.slideAnimationData = undefined;
	}

	private scroll({
		distanceX = 0,
		distanceY = 0,
	}: {
		distanceX?: number;
		distanceY?: number;
	} = {}): void {
		distanceX = this.parameters.direction.x
			? distanceX * -1
			: 0;
		distanceY = this.parameters.direction.y
			? distanceY * -1
			: 0;
		//limit distance so the result with currentScroll is within the scrollable area
		const currentScroll = this.getCurrentScroll();
		const maxScroll = this.getMaxScroll();

		let destinationX = Math.max(
			0,
			Math.min(
				maxScroll.x,
				currentScroll.x + distanceX,
			),
		);
		let destinationY = Math.max(
			0,
			Math.min(
				maxScroll.y,
				currentScroll.y + distanceY,
			),
		);

		this.DOMelement.scrollTo({
			left: destinationX,
			top: destinationY,
			behavior: 'instant',
		});
	}

	private getCurrentScroll(): { x: number; y: number } {
		return {
			x: this.DOMelement.scrollLeft,
			y: this.DOMelement.scrollTop,
		};
	}

	private getMaxScroll(): { x: number; y: number } {
		return {
			x:
				this.DOMelement.scrollWidth -
				this.DOMelement.clientWidth,
			y:
				this.DOMelement.scrollHeight -
				this.DOMelement.clientHeight,
		};
	}
	override destroy(): void {
		// Remove event listeners
		this.DOMelement.removeEventListener(
			'mousedown',
			this.boundMouseDownHandler,
		);
		window.removeEventListener(
			'mouseup',
			this.boundMouseUpHandler,
		);
		window.removeEventListener(
			'mousemove',
			this.boundDragMoveHandler,
		);

		// Remove this instance from the static instances array
		const index = DragToScroll.instances.indexOf(this);
		if (index > -1) {
			DragToScroll.instances.splice(index, 1);
		}
	}
	static override destroy(element: HTMLElement): void {
		const instance = DragToScroll.instances.find(
			(instance) => instance.DOMelement === element,
		);
		if (instance) {
			instance.destroy();
		}
	}
	static override destroyAll(): void {
		const instances = [...DragToScroll.instances];
		instances.forEach((instance) => instance.destroy());
	}
}

(window as any).DragToScroll = DragToScroll;
