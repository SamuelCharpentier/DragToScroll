interface DragMoveData {
	position: { x: number; y: number };
	timestamp: number;
}

export function calculateReleaseVelocity(
	currentData: DragMoveData,
	previousData: DragMoveData,
	maxSpeed: number,
) {
	const timeDif =
		currentData.timestamp - previousData.timestamp;
	const deltaX =
		currentData.position.x - previousData.position.x;
	const deltaY =
		currentData.position.y - previousData.position.y;
	const distance = Math.sqrt(
		Math.pow(deltaX, 2) + Math.pow(deltaY, 2),
	);
	let speed = Math.min(distance / timeDif, maxSpeed);

	if (speed <= 0.2) {
		return null;
	}

	return {
		speed,
		angle: Math.atan2(deltaY, deltaX),
	};
}
