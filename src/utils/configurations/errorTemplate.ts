export const errorTemplate = ({
	property,
	expected = '',
	received,
	behaviour = 'must be',
}: {
	property: string;
	expected?: string;
	received: any;
	behaviour?: string;
}): string =>
	`'${property}' ${behaviour} ${expected}, received ${JSON.stringify(
		received,
	)}[${typeof received}]`;
