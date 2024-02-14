import { DragToBlank } from 'drag-to-blank';

interface Direction {
	x: boolean;
	y: boolean;
}

interface AnimationOptions {
	duration: number;
	easingFactor: number;
	maxSpeed: number;
}

interface Velocity {
	speed: number;
	angle: number;
}

interface SlideAnimation {
	startTimestamp: number;
	timestamp: number;
	rafID: number;
}

interface DragToScrollConfig {
	direction?: Partial<Direction>;
	slide?: boolean;
	animationOptions?: Partial<AnimationOptions>;
	//bounce?: boolean; ///TODO implement bounce
	//overscroll?: boolean; ///TODO implement overscroll
	preventDefault?: boolean;
	stopPropagation?: boolean;
}

/**
 * Represents a draggable element with scroll functionality.
 */
class DragToScroll extends DragToBlank {
	direction: Direction;
	slide: boolean;
	animationOptions: AnimationOptions;
	// bounce: boolean; ///TODO implement bounce
	// overscroll: boolean; ///TODO implement overscroll
	velocity?: Velocity;
	slideAnimation?: SlideAnimation;
	preventDefault: boolean;
	stopPropagation: boolean;
	protected static override defaultClassName =
		'drag-to-scroll';

	private boundStopSlideAnimation: (event: Event) => void;

	constructor(
		DOMelement: HTMLElement,
		config: DragToScrollConfig = {},
	) {
		super(DOMelement);

		this.direction = {
			x: true,
			y: true,
			...config.direction,
		};
		this.slide = config.slide ?? true;
		this.animationOptions = {
			duration: 1500,
			easingFactor: 4,
			maxSpeed: 10,
			...config.animationOptions,
		};
		//this.bounce = config.bounce ?? true; ///TODO implement bounce
		//this.overscroll = config.overscroll ?? true; ///TODO implement overscroll
		this.preventDefault = config.preventDefault ?? true;
		this.stopPropagation =
			config.stopPropagation ?? true;

		this.boundStopSlideAnimation = () =>
			this.stopSlideAnimation;
	}

	private handleEventChecks(event: MouseEvent): void {
		if (this.stopPropagation) event.stopPropagation();
		if (this.preventDefault) event.preventDefault();
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
		if (this.slide && this.setReleaseVelocity())
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
			this.animationOptions.maxSpeed,
		);
		if (speed <= 0.2) return false;

		this.velocity = {
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
		this.slideAnimation = {
			rafID: requestAnimationFrame(
				this.animateSlide.bind(this),
			),
			timestamp: Date.now(),
			startTimestamp: Date.now(),
		};
	}

	private animateSlide(): void {
		if (
			this.velocity === undefined ||
			this.slideAnimation === undefined
		)
			return;

		const timestamp = Date.now();

		const timeDifStart =
			timestamp - this.slideAnimation.startTimestamp;

		if (timeDifStart < this.animationOptions.duration) {
			const timeDifLastFrame =
				timestamp - this.slideAnimation.timestamp;

			const progress =
				(timeDifStart - timeDifLastFrame / 2) /
				this.animationOptions.duration;

			const easing = this.easeOutProgress(progress);

			const { speed, angle } = this.velocity;

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
			this.slideAnimation.timestamp = timestamp;
			this.slideAnimation.rafID =
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
			this.animationOptions.easingFactor,
		);
	}

	private stopSlideAnimation(): void {
		this.DOMelement.removeEventListener(
			'wheel',
			this.boundStopSlideAnimation,
		);
		if (this.slideAnimation !== undefined)
			cancelAnimationFrame(this.slideAnimation.rafID);
		this.slideAnimation = undefined;
	}

	private scroll({
		distanceX = 0,
		distanceY = 0,
	}: {
		distanceX?: number;
		distanceY?: number;
	} = {}): void {
		distanceX *= -1;
		distanceY *= -1;
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
}

(window as any).DragToBlank = DragToBlank;
