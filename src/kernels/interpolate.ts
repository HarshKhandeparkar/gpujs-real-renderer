import { GPU, IKernelFunctionThis } from 'gpu.js';
import { GraphDimensions, Color } from '../types/RealRendererTypes';

export interface IInterpolateKernelThis extends IKernelFunctionThis {
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
 * @param xScaleFactor
 * @param yScaleFactor
 * @param xOffset
 * @param yOffset
 * @param lineThickness
 * @param lineColor
 */
export function getInterpolateKernel(
  gpu: GPU,
  dimensions: GraphDimensions,
  xScaleFactor: number,
  yScaleFactor: number,
  xOffset: number,
  yOffset: number
) {
  return gpu.createKernel(
    function(
      this: IInterpolateKernelThis,
      graphPixels: any,
      val1: [number, number],
      val2: [number, number],
      lineThickness: number,
      lineColor: Color
    ) {
      const x = this.thread.x,
        y = this.thread.y;

      const lineHalfThickness = lineThickness;

      const x1 = val1[0];
      const y1 = val1[1];

      const x2 = val2[0];
      const y2 = val2[1];

      const outX = this.output.x, outY = this.output.y;

      const X = x / (this.constants.xScaleFactor) - (outX * (this.constants.yOffset / 100)) / (this.constants.xScaleFactor);
      const Y = y / (this.constants.yScaleFactor) - (outY * (this.constants.xOffset / 100)) / (this.constants.yScaleFactor);

      let lineEqn = X * (y1 - y2) - x1 * (y1 - y2) - Y * (x1 - x2) + y1 * (x1 -x2);
      let lineDist = Math.abs(lineEqn) / Math.sqrt((y1 - y2)*(y1 - y2) + (x1 - x2)*(x1 - x2));

      const lineSine = Math.abs(
        (y2 - y1) /
        Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
      )

      const lineCosine = Math.abs(
        (x2 - x1) /
        Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
      )

      if (
        (
          lineDist <= lineHalfThickness &&
          X <= Math.max(x1, x2) + lineHalfThickness * lineSine &&
          X >= Math.min(x1, x2) - lineHalfThickness * lineSine &&
          Y <= Math.max(y1, y2) + lineHalfThickness * lineCosine &&
          Y >= Math.min(y1, y2) - lineHalfThickness * lineCosine
        )
        ||
        (
          (X - x1) ** 2 + (Y - y1) ** 2 <= lineHalfThickness ** 2 ||
          (X - x2) ** 2 + (Y - y2) ** 2 <= lineHalfThickness ** 2
        )
      ) return [lineColor[0], lineColor[1], lineColor[2]];
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
