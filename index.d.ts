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
export declare class PairwiseComparison {
    private option;
    private RI;
    private matrixSum;
    private normalizedMatrix;
    private eigenVector;
    private ax;
    private lamdaX;
    constructor(option: Option);
    private calcMatrixSum();
    private calcNormalizedMatrix();
    private calcEigenVector();
    private calcAx();
    private calcLamdaX();
    calcLamdaMax(): number;
    CI(): number;
    CR(): number;
    isConsistent(): boolean;
}
