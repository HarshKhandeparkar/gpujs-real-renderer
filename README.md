[![NPM](https://nodei.co/npm/gpujs-real-renderer.png)](https://npmjs.org/package/gpujs-real-renderer)

# GPU.js Real Renderer
A Real Time 2D Graphical Rendering Engine Made With [GPU.js](https://github.com/gpujs/gpu.js).

### Table of Contents
- [Usage](#usage)
- [Example](https://harshkhandeparkar.github.io/gpujs-real-renderer)
- [Real Renderers](#real-renderers)
- [License](LICENSE)

### Usage
RealRenderer can only be used in the browser through a `canvas` element. The library can be directly used in the browser with the included dist files or can be compiled using a packager like webpack or a framework like react.

#### Dist Files
The browserified and minified dist files can be found in the `/dist` directory on github or in the npm package.

#### Browser Usage
The dist for [GPU.js](https://github.com/gpujs/gpu.js) has to be included in a `script` tag before including the dist for RealRenderer.

```html
<script src="path/to/gpu-browser.min.js"> <!-- GPU.js Dist -->
<script src="path/to/gpujs-real-renderer-browser.min.js"> <!-- Real Renderer Dist-->
```
R
RealRenderer can be used under the namespace `GPUjsRealRenderer` from any javascript file that is loaded after the two dist files.

```js
const renderer = GPUjsRealRenderer;
const LineGraph = new renderer.LineGraph(options); // For example
```

#### Node Usage
Both `gpu.js` and `gpujs-real-renderer` packages need to be installed via npm or yarn.
The `GPU` class of GPU.js has to be explicitly provided to all of the [Real Renderers](#real-renderers).

```js
const GPU = require('gpu.js').GPU;
const LineGraph = new require('gpujs-real-renderer').RealLineGraph({GPU: GPU /**The most important part*/, canvas: document.getElementById('canvas-id')}) // LineGraph is an example.
```

NOTE: It works with typescript

### Real Renderers
A *Real Renderer* is a fancy name for a class that is exported by this package. Each of these classes can be used to render, manipulate and display specific things on a graph for specific purposes.

#### List of Real Renderers
- [`RealRenderer`](#realrenderer)
- [`RealLineGraph`](#reallinegraph)
- [`RealComplexSpace`](#realcomplexspace)
- [`RealDrawBoard`](#realdrawboard)

#### `RealRenderer`
This is the base class. It does not have any specific use. It can only display a blank graph with coordinate axes on it. See [example](https://harshkhandeparkar.github.io/gpujs-real-renderer).

```js
const renderer = GPUjsRealRenderer.RealRenderer(options); // options is an object that is explained ahead
```

##### Options
The constructor of the class takes an options javascript object as the only argument. The object can have the following properties.

- `canvas`(*HTMLCanvasElement*) (Required, No default):  The `canvas` element on which the graph should be rendered.
- `dimensions`(*Array*) (Default: `[1000, 1000]`): An array which contains the x and y dimensions(in pixels) of graph.
- `xScaleFactor`(*Number) (Default: `10`): This is a number that determines the scaling of the x-axis. A greater value zooms into the x-axis. Greater values provide more precision and lower values increase the limits of the x-axis.

Technically, each coordinate on the x-axis is divided by this number.

- `yScaleFactor`(*Number*) (Default: `1`): This is a number that determines the scaling of the y-axis. A greater value zooms into the y-axis. Greater values provide more precision and lower values increase the limits of the y-axis.

Technically, each coordinate on the y-axis is divided by this number.

- `bgColor`(*Array*) (Default: `[0, 0, 0]`): This is an array with three numbers between `0` and `1`. The numbers represent the red, green and blue color values of the background color of the graph.

- `drawAxes`(*boolean*) (Default: `true`): Whether to draw the x and y axes or not.

- `axesColor`(*Array*) (Default: `[1, 1, 1]`): Same as `bgColor` but defines the color of the x and y axes.

- `xOffset`(*Number*) (Default: `50`): Percentage offset on the graph for the x-axis.

- `xOffset`(*Number*) (Default: `50`): Percentage offset on the graph for the y-axis.

- `drawsPerFrame`(*Integer*) (Default: `1`): A draw is an iteration over the graph. The graph is manipulated once per draw and the end result is displayed at the end of every frame. This integer number determines the number of draws that should be done per frame before displaying.

- `timeStep`(*Number*) (Default: `1/60`): `RealRenderer` internally stores a `time` variable which is used to keep track of constantly changing elements on the graph. The time value is incremented by the `timeStep` value once per draw. Lower values will make things happen slower and vice versa.

This time value is not used by the `RealRenderer` class but is used by its child classes.

- `initTime`(*Number*) (Default: `0`): The initial value of the internal `time` variable.


##### Methods
The class exposes the followind methods to the user. These methods are also chainable which means that you can run another method on the value returned by the previous method call.

e.g.: `RealRenderer.draw().reset().startRender()`

- `draw(numDraws)`: Draws the graph `numDraws` number of times and displays the graph at the end of the last draw.

- `startRender()`: Starts the continous rendering of the graph. The graph will be rendered at 30 or 60 fps depending on the hardware and browser used.

- `stopRender()`: Stops the rendering.

- `toggleRender()`: Toggles the rendering.

- `getData()`: Returns a 3D array of the pixel values.

- `loadData()`: Returns a 3D array of the pixels.

- `resetTime()`: Resets the internal time value to `0`.

- `reset()`: Resets the pixels on the graph to a blank graph with the coordinate axes.

#### `RealLineGraph`
This Real Renderer extends the `RealRenderer` class and can be used to plot generated data in real-time as the data is obtained. This can be used to analyze data that changes over time.

This is a generic line graph with straight lines joining points. (The first point connects to the origin)

The data value is plotted on the y-axis and the x-axis just represents the time and the data is plotted at fixed intervals on the x-axis.

The graph automatically adjusts to accomodate new data. See [example](https://harshkhandeparkar.github.io/gpujs-real-renderer).

##### Options
Since this is a child class of `RealRenderer`, all the options of `RealRender` are applicable here as well.
Apart from those, the following are additional options that can be passed on to the constructor.

- `progressiveAxis`(*String<'x'|'y'>*) (Default: `x`): This string determines which axis should be changing to accomodate incoming data.

- `progressionMode`(*String<'overflow'|'continous'|'squeeze'>*) (Default: `overflow`): Determines how the axis should change. NOTE: `.startRender()` is necessary only if using this option with `continous` mode.

A value of `overflow` only moves the axis when there is no space to accomodate new data.

A value of `continous` changes the axis in time continously, at fixed intervals (after starting render).

A value of `squeeze` squeezes the graph to fit all the data.

- `progressInterval`(*Number*) (Default: `1`): This options only works with `continous` progressionMode. This determines the interval between the progression of the graph, in internal `time` units.

- `brushSize`(*Number*) (Default: `1`): Determines the size of the brush, i.e. the radius of the plotted points, in pixels.

- `brushColor`(*Array*) (Default: `[1, 1, 1]`): The color of the brush, i.e. the plotted points.

- `lineThickness`(*Number*) (Default: `0.05`): The thickness of the line joining the different plotted points, in coordinate units with scaleFactors.

- `lineColor`(*Array*) (Default: `[0, 0.5, 0]`): The color of the line joining different points.

##### Methods
Since this is a child class of `RealRenderer`, all the methods of `RealRender` are available here as well.
Apart from these methods, the following new methods are also available and are chainable too.

- `addData(value)`: Plots the next value on the graph. Takes a single number or a gpu.js [pipelined](https://github.com/gpujs/gpu.js#pipelining) texture (with first element as the y-value) input `value` as the argument. This method also displays the graph after adding the data.

- `getLimits()`: Returns an object containing the final range of x and y axes on the graph, after scaling and setting the x and y axes offsets. It also takes into account the progression of the graph.

The returned object contains two properties `x` and `y` each of which are arrays with the first element being the lower limit and the second, the upper limit.

- `reset()`: This is the same method as that of `RealRenderer` but it also resets the axes and the plots.

#### `RealComplexSpace`
This Real Renderer extends the `RealRenderer` class and can be used to plot changing complex numbers. A few watched numbers are plotted every time the renderer renders. A callback is fired just before the render, to change the numbers.

This class provides another class, `Complex`, to define, manipulate, add, subtract, multiply etc. complex numbers.

See [example](https://harshkhandeparkar.github.io/gpujs-real-renderer).

##### Properties (Read-Only)
- `Complex` (Static) (*Class*): A class for defining and manipulating complex numbers. Has the following methods.
  - `constructor(r, theta)`: Default constructor with r(modulus) and theta(argument) (polar form of a complex number).
  - `getCartesianForm()`: A method that returns the x and y coordinates of the same complex number in cartesian form, as an array of the form `[x, y]`.
  - `getPolarForm()`: A method that returns the r(modulus) and theta(argument) of the same complex number in polar form, as an array of the form `[r, theta]`.
  - `add(addedNum)`: Adds another number `addedNum` which is another object of `Complex` class to itself and returns the output. Also edits itself.
  - `subtract(subtractedNum)`: Subtracts another number `subtractedNum` which is another object of `Complex` class from itself and returns the output. Also edits itself.
  - `multiply(multipliedNum)`: Multiplies another number `multipliedNum` which is another object of `Complex` class to itself and returns the output. Also edits itself.
  - `divide(dividedNum)`: Divides itself by another number `dividedNum` which is another object of `Complex` class and returns the output. Also edits itself.
  - `conjugate()`: Modifies itself to be its own complex conjugate and returns itself.
  - `reciprocal()`: Modifies itself to be its own reciprocal and returns itself.
  NOTE: All of the above methods except `getCartesianForm` and `getPolarForm` are chainable.

- `watchedNumbers`(*Array*): An object that stores all the *watched* complex numbers, ie the ones that are plotted during each render. This object is of the form
```js
[
  {
    name: 'name1', // Here, `name1` is any arbitrary name, the property does not matter
    number: Complex(), // The complex number
    show: boolean, // Whether to show/plot the number or not
    persistent: boolean, // Whether the number's older locations will persist on the graph or disappear in the next render (see example)
    interpolate: boolean, // Whether to interpolate (ie draw a line between this number and another number, see example for use cases)
    interpolateTo: Complex(), // Draws a line between this number and the watched number
    attributes: Object // optional user-defined attributes
  },
  {...same}
]
```

##### Options
Since this is a child class of `RealRenderer`, all the options of `RealRender` are applicable here as well.
Apart from those, the following are additional options that can be passed on to the constructor.

- `brushSize`(*Number*) (Default: `1`): Determines the size of the brush, i.e. the radius of the plotted points, in pixels.

- `brushColor`(*Array*) (Default: `[1, 1, 1]`): The color of the brush, i.e. the plotted points.

- `lineThickness`(*Number*) (Default: `0.05`): The thickness of the line joining the different plotted points, in coordinate units with scaleFactors.

- `lineColor`(*Array*) (Default: `[0, 0.5, 0]`): The color of the line joining different points.

- `changeNumbers(watchedNumbers, time, timeStep)`(*Function*) (Default: `function(watchedNumbers) {return watchedNumbers}`): A callback that is fired at the start of every render. The first argument is the object of watched numbers (see above properties), the second argument is the internal `time` variable which can be used to keep track of render time. `timeStep` is the timeStep.
The expected return type is a similar object(but can be changed).

##### Methods
Since this is a child class of `RealRenderer`, all the methods of `RealRender` are available here as well.
Apart from these methods, the following new methods are also available and are chainable too.

- `watch(name, number, show = true, persistent = true, interpolate = false, interpolateTo = null, attributes = {})`: Add a new number to the `watchedNumbers`, see properties above.

- `clearWatched()`: Clears all watched numbers.

- `plot(number)`: Plots a single `number`, an instance of `Complex` class.

****

#### `RealDrawBoard`
This Real Renderer extends the `RealRenderer` class and can be used as a general purpose drawing board!
Click and drag on the canvas to draw, change modes to erase. The brush color and eraser/brush sized can be changed.
See [example](https://harshkhandeparkar.github.io/gpujs-real-renderer).

##### Properties (Read-Only)
- `tool` (`'brush'` | `'rainbow_brush'` | `'eraser'` | `'line'`): The current tool used on the board. This tool can be set in the options or using the `changeTool` method.
  - `brush`: Normal brush which uses the `brushColor` property as the color.
  - `rainbow_brush`: Brush with continuously changing color.
  - `eraser`: Erases.
  - `line`: Draws a line with `brushColor` property as the color.
- `toolSettings` (`Object`): Settings for all the different tools. It contains the following properties.
  - `brushSize` (`number`): Size of the `brush` tool and `rainbow_brush` tool.
  - `brushColor` (`[number, number, number]`): Color of the `brush` tool.
  - `eraserSize` (`number`): Size of the `eraser` tool.
  - `lineThickness` (`number`): Thickness of the `line` tool.
  - `lineColor` (`[number, number, number]`): Color of the `line` tool.
  - `changeRate` (`number`): Rate at which the `rainbow_brush` tool changes color.

##### Options
Since this is a child class of `RealRenderer`, all the options of `RealRender` are applicable here as well.
Apart from those, the following are additional options that can be passed on to the constructor.
- `toolSettings` (`Object`): Settings for all the different tools. Same as described in the **properties** section above.

- `allowUndo`(*Boolean*) (Default: `false`): Determines the maximum possible undos. (Use a smaller number on devices with less RAM)

- `maxUndos`(*Number*) (Default: `15`): Determines the maximum possible undos. (Use a smaller number on devices with less RAM)

- `tool` (*'brush' | 'rainbow_brush' | 'eraser' | 'line'*) (Default: `'brush'`): Determines which tool to use.

##### Methods
Since this is a child class of `RealRenderer`, all the methods of `RealRender` are available here as well.
Apart from these methods, the following new methods are also available and are chainable too.

- `startRender()` and `stopRender()`: Slightly different compared to `RealRenderer` but they don't draw continously.
- `changeTool(newTool)`: Change the tool.
- `changeToolSetting(settingName, value)`: Changes a specific setting in the `toolSettings` *property*. See **properties** section above.
- `undo(numUndos = 1)`: Undoes the specified number of brush strokes. (Defualt: undoes one stroke)
- `redo(numUndos = 1)`: Redoes the specified number of brush strokes. (Defualt: redoes one stroke)
- `clear()`: Clears the board.
- `reset()`: Clears the whole board and resets all options to original values.
