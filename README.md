# DragToScroll

DragToScroll is a TypeScript package that provides a draggable element with scroll functionality. It extends the functionality of the `DragToBlank` class and adds additional features such as direction control, slide animation, and event propagation control.

## Installation

```bash
npm install drag-to-scroll
```

## Usage

```typescript
import { DragToScroll } from 'drag-to-scroll';

const element = document.getElementById('my-element');
const config = {
	direction: { x: true, y: false },
	slide: true,
	animationOptions: {
		duration: 500,
		easingFactor: 4,
		maxSpeed: 10,
	},
	preventDefault: true,
	stopPropagation: true,
};

const draggable = new DragToScroll(element, config);
```

## Configuration

The `DragToScroll` constructor takes a configuration object with the following optional properties:

| Property           | Type    | Description                                                                                                                                                                   | Default value                                       |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `direction`        | Object  | An object with `x` and `y` properties, indicating whether the element should be draggable in the x and y directions respectively.                                             | `{ x: true, y: true }`                              |
| `slide`            | Boolean | A boolean indicating whether the element should continue to slide after the user stops dragging.                                                                              | `true`                                              |
| `animationOptions` | Object  | An object with `duration:number` (in milliseconds), `easingFactor:number` (>=1, 1 is linear), and `maxSpeed:number` (px/0.0001s) properties, controlling the slide animation. | `{ duration: 1500, easingFactor: 4, maxSpeed: 10 }` |
| `preventDefault`   | Boolean | A boolean indicating whether the default action should be prevented when the user starts dragging.                                                                            | `true`                                              |
| `stopPropagation`  | Boolean | A boolean indicating whether the event should stop being propagated when the user starts dragging.                                                                            | `true`                                              |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License
[MIT](./LICENSE)
