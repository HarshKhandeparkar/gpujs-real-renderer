import { GPU, IKernelFunctionThis } from 'gpu.js';
import { GraphDimensions, Color } from '../types/RealRendererTypes';

interface IPlotKernelThis extends IKernelFunctionThis {
  constants: {
    xScaleFactor: number,
    yScaleFactor: number,
    xOffset: number,
    yOffset: number
  }
}

/**
 * @param gpu
 * @param dimensions
 * @param brushSize
 * @param brushColor
 * @param xScaleFactor
 * @param yScaleFactor
 * @param xOffset
 * @param yOffset
 */
export function getPlotKernel(
  gpu: GPU,
  dimensions: GraphDimensions,
  xScaleFactor: number,
  yScaleFactor: number,
  xOffset: number,
  yOffset: number,
  brushSize: number,
  brushColor: Color
) {
  return gpu.createKernel(
    function(
      this: IPlotKernelThis,
      graphPixels: any,
      valX: number,
      valY: number
    ) {
      const x = this.thread.x,
        y = this.thread.y;

      const outX = this.output.x, outY = this.output.y;

      const X = x / (this.constants.xScaleFactor) - (outX * (this.constants.yOffset/ 100)) / (this.constants.xScaleFactor);
      const Y = y / (this.constants.yScaleFactor) - (outY * (this.constants.xOffset/ 100)) / (this.constants.yScaleFactor);

      const xDist = (X - valX) * (this.constants.xScaleFactor);
      const yDist = (Y - valY) * (this.constants.yScaleFactor);

      const dist = Math.sqrt(xDist*xDist + yDist*yDist);

      if (dist <= brushSize) return [brushColor[0], brushColor[1], brushColor[2]];
      else return graphPixels[this.thread.y][this.thread.x];
    },
    {
      output: dimensions,
      pipeline: true,
      constants: {
        xScaleFactor,
        yScaleFactor,
        xOffset,
        yOffset
      },
      constantTypes: {
        xScaleFactor: 'Float',
        yScaleFactor: 'Float',
        xOffset: 'Float',
        yOffset: 'Float'
      }
    }
  )
}
