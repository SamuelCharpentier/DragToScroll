import { DragToBlank } from 'drag-to-blank';
import { DeepPartial } from './lib/deepPartialType';
import {
	DragToScrollParameters,
	DragToScrollConfigurations,
} from './utils/configurations/type';
import { validateConfigurations } from './utils/configurations/validateConfigurations';
import { calculateScroll } from './utils/calculateScroll';
import { calculateAnimationFrame } from './utils/calculateAnimationFrame';
import { calculateReleaseVelocity } from './utils/calculateReleaseVelocity';

interface Velocity {
	speed: number;
	angle: number;
}

interface SlideAnimationData {
	startTimestamp: number;
	timestamp: number;
	rafID: number;
}

function deepMergeConfigurations<T>(
	defaultConfig: T,
	userConfig: DeepPartial<T>,
): T {
	const result = { ...defaultConfig };
	for (const key in userConfig) {
		const value = userConfig[key];
		if (value !== undefined) {
			if (
				typeof value === 'object' &&
				value !== null
			) {
				result[key] = deepMergeConfigurations(
					result[key],
					value,
				);
			} else {
				result[key] = value;
			}
		}
	}
	return result;
}

const defaultParameters: DragToScrollParameters = {
	direction: { x: true, y: true },
	animation: {
		timing: {
			duration: 1500,
			easingFactor: 4,
			maxSpeed: 6,
		},
		slide: true,
		//bounce: true, ///TODO implement bounce
		//overscroll: true, ///TODO implement overscroll
	},
	preventDefault: true,
	stopPropagation: true,
} as const;

/**
 * Represents a draggable element with scroll functionality.
 */
export class DragToScroll<
	T extends HTMLElement = HTMLElement,
> extends DragToBlank {
	parameters: DragToScrollParameters;

	private releaseVelocity?: Velocity;
	private slideAnimationData?: SlideAnimationData;
	protected static override defaultClassName =
		'drag-to-scroll';
	static override instances: DragToScroll<HTMLElement>[] =
		[];

	private boundStopSlideAnimation: (event: Event) => void;

	constructor(
		DOMelement: T,
		configurations: DragToScrollConfigurations = {},
	) {
		validateConfigurations(configurations);
		super(DOMelement);

		this.parameters =
			this.initializeConfiguration(configurations);

		this.boundStopSlideAnimation =
			this.initializeEventListeners();

		DragToScroll.instances.push(this);
	}

	private initializeConfiguration(
		configurations: DragToScrollConfigurations,
	): DragToScrollParameters {
		if (
			typeof configurations.direction?.x ===
				'boolean' &&
			configurations.direction.y === undefined
		) {
			configurations.direction.y =
				!configurations.direction.x;
		}
		if (
			typeof configurations.direction?.y ===
				'boolean' &&
			configurations.direction.x === undefined
		) {
			configurations.direction.x =
				!configurations.direction.y;
		}
		return deepMergeConfigurations(
			defaultParameters,
			configurations,
		);
	}

	private initializeEventListeners(): () => void {
		return () => this.stopSlideAnimation();
	}

	private handleEventPropagationAndPrevention(
		event: MouseEvent,
	): void {
		if (this.parameters.stopPropagation)
			event.stopPropagation();
		if (this.parameters.preventDefault)
			event.preventDefault();
	}

	protected override mouseDown(event: MouseEvent): void {
		this.handleEventPropagationAndPrevention(event);
		this.stopSlideAnimation();
	}

	protected override dragMove(event: MouseEvent): void {
		this.handleEventPropagationAndPrevention(event);
		const dragMoveData = this.mouseData.get('dragMove');
		const prevDragMoveData = dragMoveData?.prev;
		if (!dragMoveData || !prevDragMoveData) {
			throw new Error('Drag move data is incomplete');
		}

		const distanceX =
			dragMoveData.position.x -
			prevDragMoveData.position.x;
		const distanceY =
			dragMoveData.position.y -
			prevDragMoveData.position.y;
		this.performScroll({ distanceX, distanceY });
	}

	protected override dragEnd(event: MouseEvent): void {
		this.handleEventPropagationAndPrevention(event);
		this.handleSlideAnimation();
	}

	private handleSlideAnimation(): void {
		if (
			this.parameters.animation.slide &&
			this.setReleaseVelocity()
		) {
			this.startAnimateSlide();
		}
	}

	private setReleaseVelocity(): boolean {
		const dragMoveData = this.mouseData.get('dragMove');

		if (
			dragMoveData === undefined ||
			dragMoveData.prev === undefined
		) {
			return false;
		}

		const velocity = calculateReleaseVelocity(
			dragMoveData,
			dragMoveData.prev,
			this.parameters.animation.timing.maxSpeed,
		);

		if (velocity) {
			this.releaseVelocity = velocity;
			return true;
		}

		return false;
	}

	private startAnimateSlide() {
		this.DOMelement.addEventListener(
			'wheel',
			this.boundStopSlideAnimation,
		);
		this.slideAnimationData = {
			rafID: requestAnimationFrame(
				this.handleAnimationFrame.bind(this),
			),
			timestamp: Date.now(),
			startTimestamp: Date.now(),
		};
	}

	private handleAnimationFrame(): void {
		if (
			this.releaseVelocity === undefined ||
			this.slideAnimationData === undefined
		)
			return;

		const result = calculateAnimationFrame(
			this.releaseVelocity,
			this.slideAnimationData.startTimestamp,
			this.slideAnimationData.timestamp,
			this.parameters.animation.timing.duration,
			this.parameters.animation.timing.easingFactor,
		);

		if (result.continue) {
			this.performScroll({
				distanceX: result.distanceX,
				distanceY: result.distanceY,
			});
			this.slideAnimationData.timestamp =
				result.timestamp;
			this.slideAnimationData.rafID =
				requestAnimationFrame(
					this.handleAnimationFrame.bind(this),
				);
		} else {
			this.stopSlideAnimation();
		}
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

	private performScroll({
		distanceX = 0,
		distanceY = 0,
	}: {
		distanceX?: number;
		distanceY?: number;
	} = {}): void {
		const scrollTo = calculateScroll(
			this.DOMelement,
			this.parameters,
			distanceX,
			distanceY,
		);
		this.DOMelement.scrollTo({
			...scrollTo,
			behavior: 'instant',
		});
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
