// ignore file coverage
export const sleep = (miliseconds: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, miliseconds);
	});
