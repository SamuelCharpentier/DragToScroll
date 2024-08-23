import { errorTemplate } from '../errorTemplate';

export const getDirectionConfigurationErrors = (
	directionConfigurations: any,
) => {
	const errors: string[] = [];
	if (
		directionConfigurations !== undefined &&
		typeof directionConfigurations !== 'object'
	) {
		errors.push(
			errorTemplate({
				property: 'direction',
				expected: `an (object) with any of the following properties: 'x' (boolean), 'y' (boolean)`,
				received: directionConfigurations,
			}),
		);
	}
	['x', 'y'].forEach((direction) => {
		if (
			directionConfigurations?.[direction] !==
				undefined &&
			typeof directionConfigurations[direction] !==
				'boolean'
		) {
			errors.push(
				errorTemplate({
					property: `direction.${direction}`,
					expected: `a (boolean) when defined`,
					received:
						directionConfigurations[direction],
				}),
			);
		}
	});
	return errors;
};
