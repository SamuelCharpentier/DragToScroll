# DragToScroll

DragToScroll is a TypeScript package that provides a draggable element with scroll functionality. It extends the functionality of the `DragToBlank` class and adds additional features such as direction control, slide animation, and event propagation control.

## Installation

```bash
npm install drag-to-scroll
```

## Usage

### Instantiation without configurations

You can create a `DragToScroll` instance without any configurations. The default configurations will be used.

```typescript
import { DragToScroll } from 'drag-to-scroll';

const element = document.getElementById('my-element');

const draggable = new DragToScroll(element);
```

### Instantiation with configurations

You can also provide a configuration object when creating a `DragToScroll` instance.

```typescript
import { DragToScroll } from 'drag-to-scroll';

const element = document.getElementById('my-element');
const config = {
	direction: { x: true, y: false },
	animation: {
		timing: {
			duration: 500,
			easingFactor: 4,
			maxSpeed: 10,
		},
		slide: true,
	},
	preventDefault: true,
	stopPropagation: true,
};

const draggable = new DragToScroll(element, config);
```

### Using the `apply` method

The `apply` method allows you to apply the `DragToScroll` functionality to all elements with a specific class. By default, it applies to elements with the class 'drag-to-scroll', but you can provide a different class as an argument.

```typescript
import { DragToScroll } from 'drag-to-scroll';

DragToScroll.apply(); // Applies to all elements with the class 'drag-to-scroll'

DragToScroll.apply('my-custom-class'); // Applies to all elements with the class 'my-custom-class'
```

### The `destroy` instance method

This method removes the event listeners from the instance and removes the instance from the static `instances` array.

```typescript
const element = document.getElementById('my-element');
const draggable = new DragToScroll(element);
// ...
draggable.destroy();
```

### The `destroy` static method

This method finds an instance with a specific DOM element from the static `instances` array and destroys it using its instance method.

```typescript
const element = document.getElementById('my-element');
const draggable = new DragToScroll(element);
// ...
DragToScroll.destroy(element);
```

### The `destroyAll` static method

This method loops over the static `instances` array and destroys all instances.

```typescript
DragToScroll.destroyAll();
```

## Configuration

The `DragToScroll` constructor takes a configuration object with the following optional properties:

| Property          | Type    | Description                                                                                                                       | Default value          |
| ----------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `direction`       | Object  | An object with `x` and `y` properties, indicating whether the element should be draggable in the x and y directions respectively. | `{ x: true, y: true }` |
| `animation`       | Object  | An object controlling the slide animation. See [Animation Configuration](#animation-configuration) for more details.              |                        |
| `preventDefault`  | Boolean | A boolean indicating whether the default action should be prevented when the user starts dragging.                                | `true`                 |
| `stopPropagation` | Boolean | A boolean indicating whether the event should stop being propagated when the user starts dragging.                                | `true`                 |

### Animation Configuration

The `animation` property in the configuration object controls the slide animation. It has the following properties:

| Property | Type    | Description                                                                                                                                  | Default value                                       |
| -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `timing` | Object  | An object with `duration:number` (in milliseconds), `easingFactor:number` (>=1, 1 is linear), and `maxSpeed:number` (px/0.0001s) properties. | `{ duration: 1500, easingFactor: 4, maxSpeed: 10 }` |
| `slide`  | Boolean | A boolean indicating whether the element should continue to slide after the user stops dragging.                                             | `true`                                              |

## Properties

### `instances`

This is a static property that holds an array of all active `DragToScroll` instances.

```typescript
static instances: DragToScroll[] = [];
```

You can use this property to access all active instances of the `DragToScroll` class. For example, you can use it to find an instance:

```typescript
const element = document.getElementById('my-element');
new DragToScroll(element);
// ...
const instance = DragToScroll.instances.find(
	(i) => i.element === element,
);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License
[MIT](./LICENSE)
