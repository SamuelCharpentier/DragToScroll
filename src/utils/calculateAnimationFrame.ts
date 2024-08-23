export function calculateAnimationFrame(
	releaseVelocity: { speed: number; angle: number },
	startTimestamp: number,
	lastFrameTimestamp: number,
	duration: number,
	easingFactor: number,
) {
	const timestamp = Date.now();
	const timeDifStart = timestamp - startTimestamp;
	const timeDifLastFrame = timestamp - lastFrameTimestamp;

	if (timeDifStart < duration) {
		const progress =
			(timeDifStart - timeDifLastFrame / 2) /
			duration;
		const easing = easeOutProgress(
			progress,
			easingFactor,
		);
		const { speed, angle } = releaseVelocity;
		const easedSpeedByFrameDuration =
			speed * easing * timeDifLastFrame;

		const distanceX =
			Math.cos(angle) * easedSpeedByFrameDuration;
		const distanceY =
			Math.sin(angle) * easedSpeedByFrameDuration;

		return {
			distanceX,
			distanceY,
			timestamp,
			continue: true,
		};
	}

	return {
		distanceX: 0,
		distanceY: 0,
		timestamp,
		continue: false,
	};
}

function easeOutProgress(
	progress: number,
	easingFactor: number,
) {
	return Math.pow(1 - progress, easingFactor);
}
