import { errorTemplate } from '../errorTemplate';

export const getAnimationConfigurationErrors = (
	configurations: any,
) => {
	const errors: string[] = [];
	if (
		configurations !== undefined &&
		typeof configurations !== 'object'
	) {
		errors.push(
			errorTemplate({
				property: 'animation',
				expected: `an (object) with any of the following properties: 'timing' (object), 'slide' (boolean)`,
				received: configurations,
			}),
		);
	}
	if (
		configurations?.timing !== undefined &&
		typeof configurations.timing !== 'object'
	) {
		errors.push(
			errorTemplate({
				property: 'animation.timing',
				expected: `an (object) with any of the following properties: 'duration' (number), 'easingFactor' (number), 'maxSpeed' (number)`,
				received: configurations.timing,
			}),
		);
	}
	['duration', 'easingFactor', 'maxSpeed'].forEach(
		(property) => {
			const value =
				configurations?.timing?.[property];
			if (
				value !== undefined &&
				typeof value !== 'number'
			) {
				errors.push(
					errorTemplate({
						property: `animation.timing.${property}`,
						expected: 'a (number)',
						received: value,
					}),
				);
			}
		},
	);

	const { duration, easingFactor, maxSpeed } =
		configurations?.timing || {};
	if (duration !== undefined && duration < 0) {
		errors.push(
			errorTemplate({
				property: `animation.timing.duration`,
				behaviour: "can't be less than 0",
				received: duration,
			}),
		);
	}
	if (easingFactor !== undefined && easingFactor < 1) {
		errors.push(
			errorTemplate({
				property: 'animation.timing.easingFactor',
				behaviour: "can't be less than 1",
				received: easingFactor,
			}),
		);
	}
	if (maxSpeed !== undefined && maxSpeed < 0) {
		errors.push(
			errorTemplate({
				property: 'animation.timing.maxSpeed',
				behaviour: "can't be less than 0",
				received: maxSpeed,
			}),
		);
	}

	if (
		configurations?.slide !== undefined &&
		typeof configurations.slide !== 'boolean'
	) {
		errors.push(
			errorTemplate({
				property: 'animation.slide',
				expected: 'a (boolean)',
				received: configurations.slide,
			}),
		);
	}
	return errors;
};
