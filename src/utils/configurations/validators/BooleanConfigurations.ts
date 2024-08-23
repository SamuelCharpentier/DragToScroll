import { errorTemplate } from '../errorTemplate';

export const getBooleanPropertyError = (
	property: string,
	value: any,
) => {
	if (value !== undefined && typeof value !== 'boolean') {
		return errorTemplate({
			property,
			expected: 'a (boolean)',
			received: value,
		});
	}
};
