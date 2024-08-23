export function calculateScroll(
	element: HTMLElement,
	parameters: { direction: { x: boolean; y: boolean } },
	distanceX: number = 0,
	distanceY: number = 0,
): { left: number; top: number } {
	distanceX = parameters.direction.x ? distanceX * -1 : 0;
	distanceY = parameters.direction.y ? distanceY * -1 : 0;

	const currentScroll = getCurrentScroll(element);
	const maxScroll = getMaxScroll(element);

	const destinationX = Math.max(
		0,
		Math.min(maxScroll.x, currentScroll.x + distanceX),
	);
	const destinationY = Math.max(
		0,
		Math.min(maxScroll.y, currentScroll.y + distanceY),
	);

	return { left: destinationX, top: destinationY };
}

function getCurrentScroll(element: HTMLElement): {
	x: number;
	y: number;
} {
	return {
		x: element.scrollLeft,
		y: element.scrollTop,
	};
}

function getMaxScroll(element: HTMLElement): {
	x: number;
	y: number;
} {
	return {
		x: element.scrollWidth - element.clientWidth,
		y: element.scrollHeight - element.clientHeight,
	};
}
