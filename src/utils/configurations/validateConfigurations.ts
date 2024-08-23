import {
	DragToScrollConfigurations,
	DragToScrollParameters,
} from './type';
import { getDirectionConfigurationErrors } from './validators/DirectionConfigucations';
import { getAnimationConfigurationErrors } from './validators/AnimationConfigurations';
import { getBooleanPropertyError } from './validators/BooleanConfigurations';

export const validateConfigurations = (
	configurations: any,
) => {
	const errors: string[] = [];

	errors.push(
		...getDirectionConfigurationErrors(
			configurations.direction,
		),
	);
	errors.push(
		...getAnimationConfigurationErrors(
			configurations.animation,
		),
	);
	['stopPropagation', 'preventDefault'].forEach(
		(property) => {
			const error = getBooleanPropertyError(
				property,
				configurations[property],
			);
			if (error) {
				errors.push(error);
			}
		},
	);

	if (errors.length > 0) {
		throw new Error(
			`${errors.length} error${
				errors.length > 1 ? 's' : ''
			} found in user configurations:\n\t${errors.join(
				'\n\t',
			)}`,
		);
	}
	return true;
};
