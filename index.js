"use strict";
var lodash_1 = require("lodash");
/**
 * PairwiseComparison
 */
var PairwiseComparison = (function () {
    function PairwiseComparison(option) {
        this.option = option;
        this.RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];
        var isValid = Math.sqrt(this.option.matrix.length) === this.option.n;
        if (!isValid) {
            throw Error("one of matrix or n even both are invalid");
        }
    }
    PairwiseComparison.prototype.calcMatrixSum = function () {
        if (!this.matrixSum) {
            var N_1 = this.option.n;
            var Matrix_1 = this.option.matrix;
            // calculate 
            this.matrixSum = lodash_1.range(0, N_1).map(function (y) {
                return lodash_1.sum(lodash_1.range(0, N_1).map(function (x) { return Matrix_1[x * N_1 + y]; }));
            });
        }
        return this.matrixSum;
    };
    PairwiseComparison.prototype.calcNormalizedMatrix = function () {
        if (!this.normalizedMatrix) {
            var N_2 = this.option.n;
            var Matrix_2 = this.option.matrix;
            var MatrixSum_1 = this.calcMatrixSum();
            // calculate
            this.normalizedMatrix = lodash_1.range(0, N_2 * N_2).map(function (position) { return Matrix_2[position] / MatrixSum_1[position % N_2]; });
        }
        return this.normalizedMatrix;
    };
    PairwiseComparison.prototype.calcEigenVector = function () {
        if (!this.eigenVector) {
            var N_3 = this.option.n;
            var NormalizedMatrix_1 = this.calcNormalizedMatrix();
            // calculate
            this.eigenVector = lodash_1.range(0, N_3).map(function (y) {
                return lodash_1.mean(lodash_1.range(0, N_3).map(function (x) { return NormalizedMatrix_1[y * N_3 + x]; }));
            });
        }
        return this.eigenVector;
    };
    PairwiseComparison.prototype.calcAx = function () {
        if (!this.ax) {
            var N_4 = this.option.n;
            var Matrix_3 = this.option.matrix;
            var EigenVector_1 = this.calcEigenVector();
            // calculate
            this.ax = lodash_1.range(0, N_4).map(function (y) {
                return lodash_1.sum(lodash_1.range(0, N_4).map(function (x) { return EigenVector_1[x] * Matrix_3[y * N_4 + x]; }));
            });
        }
        return this.ax;
    };
    PairwiseComparison.prototype.calcLamdaX = function () {
        if (!this.lamdaX) {
            var N = this.option.n;
            var Ax_1 = this.calcAx();
            var EigenVector_2 = this.calcEigenVector();
            // calculate
            this.lamdaX = lodash_1.range(0, N).map(function (y) { return Ax_1[y] / EigenVector_2[y]; });
        }
        return this.lamdaX;
    };
    PairwiseComparison.prototype.calcLamdaMax = function () {
        return lodash_1.mean(this.calcLamdaX());
    };
    PairwiseComparison.prototype.CI = function () {
        var N = this.option.n;
        return (this.calcLamdaMax() - N) / (N - 1);
    };
    PairwiseComparison.prototype.CR = function () {
        var N = this.option.n;
        var ri = this.RI[N - 1];
        var ci = this.CI();
        if (ri == 0) {
            return 0;
        }
        else {
            return ci / ri;
        }
    };
    PairwiseComparison.prototype.isConsistent = function () {
        return this.CR() < 0.1;
    };
    return PairwiseComparison;
}());
exports.PairwiseComparison = PairwiseComparison;
