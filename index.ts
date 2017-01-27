import { range, sum, mean } from "lodash";
/**
 * Option
 */
export interface Option {
  n: number;
  matrix: Array<number>;
}
/**
 * PairwiseComparison
 */
export class PairwiseComparison {

  private RI: Array<number> = [ 0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59 ];

  private matrixSum: Array<number>;
  private normalizedMatrix: Array<number>;
  private eigenVector: Array<number>;
  private ax: Array<number>;
  private lamdaX: Array<number>;

  constructor(private option: Option) {
    const isValid = Math.sqrt(this.option.matrix.length) === this.option.n;
    if(!isValid) {
      throw Error("one of matrix or n even both are invalid");
    }
  }

  private calcMatrixSum(): Array<number> {
    if (!this.matrixSum) {
      const N = this.option.n;
      const Matrix = this.option.matrix;
      // calculate 
      this.matrixSum = range(0, N).map((y: number) => { 
        return sum(range(0, N).map((x: number) => Matrix[x * N + y]));
      });
    }
    return this.matrixSum; 
  }

  private calcNormalizedMatrix(): Array<number> {
    if(!this.normalizedMatrix) {
      const N = this.option.n;
      const Matrix = this.option.matrix;
      const MatrixSum = this.calcMatrixSum();
      // calculate
      this.normalizedMatrix = range(0, N * N).map((position: number) => Matrix[position] / MatrixSum[position % N]);
    }
    return this.normalizedMatrix;
  }

  private calcEigenVector(): Array<number> {
    if(!this.eigenVector) {
      const N = this.option.n;
      const NormalizedMatrix = this.calcNormalizedMatrix();
      // calculate
      this.eigenVector = range(0, N).map((y: number) => {
        return mean(range(0, N).map((x: number) => NormalizedMatrix[y * N + x]));
      });
    }
    return this.eigenVector;
  }

  private calcAx(): Array<number> {
    if(!this.ax) {
      const N = this.option.n;
      const Matrix = this.option.matrix;
      const EigenVector = this.calcEigenVector();
      // calculate
      this.ax = range(0, N).map((y: number) => {
        return sum(range(0, N).map((x: number) => EigenVector[x] * Matrix[y * N + x]));
      });
    }
    return this.ax;
  }

  private calcLamdaX(): Array<number> {
    if(!this.lamdaX) {
      const N = this.option.n;
      const Ax = this.calcAx();
      const EigenVector = this.calcEigenVector();
      // calculate
      this.lamdaX = range(0, N).map((y: number) => Ax[y] / EigenVector[y]);
    }
    return this.lamdaX;
  }

  public calcLamdaMax(): number {
    return mean(this.calcLamdaX());
  }

  public CI(): number {
    const N = this.option.n;
    return (this.calcLamdaMax() - N) / (N - 1);
  }

  public CR(): number {
    const N = this.option.n;
    const ri = this.RI[N - 1];
    const ci = this.CI();
    if(ri == 0) {
      return 0;
    } else {
      return ci / ri;
    }
  }

  public isConsistent(): boolean {
    return this.CR() < 0.1;
  }
}