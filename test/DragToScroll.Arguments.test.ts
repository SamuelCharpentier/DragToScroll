import { DragToScroll } from '../src';
import { createScrollableElement } from './createScrollableElement';

describe('DragToScroll', () => {
	let element: HTMLElement;
	let instance: DragToScroll;
	let scrollToSpy: jest.SpyInstance;
	let mouseDownEvent: MouseEvent;

	beforeEach(() => {
		element = createScrollableElement();
		scrollToSpy = jest.spyOn(element, 'scrollTo');
		mouseDownEvent = new MouseEvent('mousedown');
	});

	it('should require an HTML element to create an instance and assign that element to its DOMelement property', () => {
		instance = new DragToScroll(element);
		expect(instance).toBeInstanceOf(DragToScroll);
		expect(instance.DOMelement).toBe(element);
	});

	it('should throw an error if the first argument is not an HTML element', () => {
		expect(() => {
			new DragToScroll({} as any as HTMLElement);
		}).toThrow();
	});

	describe('configurations', () => {
		it('should have default configurations', () => {
			instance = new DragToScroll(element);
			expect(instance.parameters).toEqual({
				direction: {
					x: true,
					y: true,
				},
				animation: {
					timing: {
						duration: 1500,
						easingFactor: 4,
						maxSpeed: 10,
					},
					slide: true,
				},
				preventDefault: true,
				stopPropagation: true,
			});
		});

		it('should accept custom configurations', () => {
			instance = new DragToScroll(element, {
				direction: { x: true, y: false },
				animation: {
					timing: {
						duration: 2000,
						easingFactor: 5,
						maxSpeed: 15,
					},
					slide: false,
				},
				preventDefault: false,
				stopPropagation: false,
			});
			expect(instance.parameters).toEqual({
				direction: {
					x: true,
					y: false,
				},
				animation: {
					timing: {
						duration: 2000,
						easingFactor: 5,
						maxSpeed: 15,
					},
					slide: false,
				},
				preventDefault: false,
				stopPropagation: false,
			});
		});
		describe('validation gives helpful errors', () => {
			it('if the direction configuration is not an object', () => {
				expect(() => {
					new DragToScroll(element, {
						direction: true as any,
					});
				}).toThrow(
					`'direction' must be an (object) with any of the following properties: 'x' (boolean), 'y' (boolean), received true[boolean]`,
				);
			});
			it('if the direction x configuration is not a boolean', () => {
				expect(() => {
					new DragToScroll(element, {
						direction: {
							x: 'true' as any,
						},
					});
				}).toThrow(
					`'direction.x' must be a (boolean) when defined, received "true"[string]`,
				);
			});
			it('if the direction y configuration is not a boolean', () => {
				expect(() => {
					new DragToScroll(element, {
						direction: {
							y: 23 as any,
						},
					});
				}).toThrow(
					`'direction.y' must be a (boolean) when defined, received 23[number]`,
				);
			});
			it('if the animation configuration is not an object', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: true as any,
					});
				}).toThrow(
					`'animation' must be an (object) with any of the following properties: 'timing' (object), 'slide' (boolean), received true[boolean]`,
				);
			});
			it('if the animation timing configuration is not an object', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: true as any,
						},
					});
				}).toThrow(
					`animation.timing' must be an (object) with any of the following properties: 'duration' (number), 'easingFactor' (number), 'maxSpeed' (number), received true[boolean]`,
				);
			});
			it('if the animation timing duration configuration is not a number', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								duration: '2000' as any,
							},
						},
					});
				}).toThrow(
					`'animation.timing.duration' must be a (number), received \"2000\"[string]`,
				);
			});
			it('if the animation timing easingFactor configuration is not a number', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								easingFactor: '5' as any,
							},
						},
					});
				}).toThrow(
					`'animation.timing.easingFactor' must be a (number), received \"5\"[string]`,
				);
			});
			it('if the animation timing maxSpeed configuration is not a number', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								maxSpeed: '15' as any,
							},
						},
					});
				}).toThrow(
					`'animation.timing.maxSpeed' must be a (number), received \"15\"[string]`,
				);
			});
			it('if the animation timing duration configuration is less than 0', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								duration: -2000,
							},
						},
					});
				}).toThrow(
					`'animation.timing.duration' can't be less than 0 , received -2000[number]`,
				);
			});
			it('if the animation timing easingFactor configuration is less than 1', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								easingFactor: -5,
							},
						},
					});
				}).toThrow(
					`'animation.timing.easingFactor' can't be less than 1 , received -5[number]`,
				);
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								easingFactor: 0.5,
							},
						},
					});
				}).toThrow(
					`'animation.timing.easingFactor' can't be less than 1 , received 0.5[number]`,
				);
			});
			it('if the animation timing maxSpeed configuration is less than 0', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							timing: {
								maxSpeed: -15,
							},
						},
					});
				}).toThrow(
					`'animation.timing.maxSpeed' can't be less than 0 , received -15[number]`,
				);
			});
			it('if the animation slide configuration is not a boolean', () => {
				expect(() => {
					new DragToScroll(element, {
						animation: {
							slide: 'false' as any,
						},
					});
				}).toThrow(
					`'animation.slide' must be a (boolean), received \"false\"[string]`,
				);
			});
			test.todo(
				'if the animation bounce configuration is not a boolean',
			);
			test.todo(
				'if the animation overscroll configuration is not a boolean',
			);
			it('if the preventDefault configuration is not a boolean', () => {
				expect(() => {
					new DragToScroll(element, {
						preventDefault: 'true' as any,
					});
				}).toThrow(
					`'preventDefault' must be a (boolean), received \"true\"[string]`,
				);
			});
			it('if the stopPropagation configuration is not a boolean', () => {
				expect(() => {
					new DragToScroll(element, {
						stopPropagation: 'true' as any,
					});
				}).toThrow(
					`'stopPropagation' must be a (boolean), received \"true\"[string]`,
				);
			});
			it('when more than one error is found in the configuration', () => {
				const expectedErrors = [
					"'direction.y' must be a (boolean) when defined, received 23[number]",
					'\'animation.timing.duration\' must be a (number), received "2000"[string]',
					'\'preventDefault\' must be a (boolean), received "true"[string]',
					'\'stopPropagation\' must be a (boolean), received "true"[string]',
				];
				let thrownError: Error;

				expect(() => {
					try {
						new DragToScroll(element, {
							direction: {
								x: true,
								y: 23 as any,
							},
							animation: {
								timing: {
									duration: '2000' as any,
								},
							},
							preventDefault: 'true' as any,
							stopPropagation: 'true' as any,
						});
					} catch (error) {
						thrownError = error as Error;
						throw error;
					}
				}).toThrow();

				expectedErrors.forEach((expectedError) => {
					expect(thrownError.message).toContain(
						expectedError,
					);
				});
			});
		});
	});
});
