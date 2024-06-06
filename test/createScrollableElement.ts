// ignore file coverage
export function createScrollableElement(
	scroll: {
		width: number;
		height: number;
		top: number;
		left: number;
	} = { width: 1000, height: 1000, top: 0, left: 0 },
	client: { width: number; height: number } = {
		width: 100,
		height: 100,
	},
): HTMLElement {
	const element = document.createElement('div');

	element.scrollLeft = scroll.left;
	element.scrollTop = scroll.top;

	Object.defineProperty(element, 'scrollWidth', {
		configurable: true,
		value: scroll.width,
	});

	Object.defineProperty(element, 'scrollHeight', {
		configurable: true,
		value: scroll.height,
	});

	Object.defineProperty(element, 'clientWidth', {
		configurable: true,
		value: client.width,
	});

	Object.defineProperty(element, 'clientHeight', {
		configurable: true,
		value: client.height,
	});

	element.scrollTo = function (
		this: HTMLElement,
		x?: number | ScrollToOptions,
		y?: number,
	): void {
		if (
			typeof x === 'number' &&
			typeof y === 'number'
		) {
			this.scrollLeft = x;
			this.scrollTop = y;
		} else if (typeof x === 'object' && x !== null) {
			const options = {
				left:
					x.left !== undefined
						? x.left
						: this.scrollLeft,
				top:
					x.top !== undefined
						? x.top
						: this.scrollTop,
			};

			this.scrollLeft = options.left;
			this.scrollTop = options.top;
		}
	};

	return element;
}
