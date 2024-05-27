# DragToScroll requirements

## Must have

### Drag elements in any direction using the mouse

-   ✅ Drag to scroll is responsive to the speed of the mouse
-   ✅ Drag to scroll continues even if the mouse leaves the bounds of the target after the mouse down event
-   ✅ Drag to scroll stops when the mouse is released, even if the mouse is outside the bounds of the target

### Scroll with drag in eighter directions using the mouse

-   ✅ Scrolling is smooth
    -   ✅ There isn't any gittering or lag
-   ✅ Scrolling follows the cursor
-   ✅ Scrolling is still native with other devices
-   ✅ Scrolling doesn't affect performance in a significant way
    -   ✅ There isn't any noticeable lag or freeze frames
-   ✅ Scroll axis can be limited to one axis

## Nice to have

### Slide when released in movement (like on mobile)

-   ✅ Sliding is affected by the active momentum
    -   ✅ Release momentum speed should be limited to a customisable maximum value
-   ✅ Sliding is smooth
    -   ✅ There isn't any gittering
-   ✅ Sliding slows down over time
    -   ✅ Slow down is configurable using easing factor and animation duration
    -   ✅ Slow down doesn't stop on one axis and continue in another
    -   ✅ Slow down doesn't ease at differect rated in different directions
-   ✅ Sliding doesn't affect performance in a significant way
    -   ✅ There isn't any noticeable lag or freeze frames
-   ✅ Sliding stops if scroll extremeties are reached

### Bounce when reaching scroll extremeties with some momentum left (like on mobile)

-   🟥 Bounce is affected by the active momentum
-   🟥 Bounce is smooth
    -   🟥 There isn't any gittering
-   🟥 Bounce animate like an elastic, finishing at the scroll end;
-   🟥 Bounce doesn't affect performance in a significant way
    -   🟥 There isn't any noticeable lag or freeze frames

### Overscroll when reaching scroll extremeties while dragging (like on mobile)

-   🟥 Overscroll is affected by the active drag
-   🟥 Overscroll is smooth
    -   🟥 There isn't any gittering
-   🟥 Overscroll exponentially diminish the scroll behaviour, imitating resistance like an elastic;
-   🟥 Overscroll doesn't affect performance in a significant way
    -   🟥 There isn't any noticeable lag or freeze frames
