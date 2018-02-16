"use strict";
/**
 * Copyright 2018 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TSMT$CubicSpline = (function () {
    /**
     * Construct a new {TSMT$NaturalCubicSpline)
       *
     * @returns {nothing}
     */
    function TSMT$CubicSpline() {
        this.ONE_SIXTH = 0.1666666666667;
        this._t = new Array();
        this._y = new Array();
        this._u = new Array();
        this._v = new Array();
        this._h = new Array();
        this._b = new Array();
        this._z = new Array();
        this._hInv = new Array();
        this._invalidate = true;
        this._knots = 0;
    }
    Object.defineProperty(TSMT$CubicSpline.prototype, "knotCount", {
        /**
         * Access the total number of interpolation points or knots
         *
         * @returns {number} Number of interpolation points or knots in the spline
         */
        get: function () {
            return this._knots;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$CubicSpline.prototype, "interpolationPoints", {
        /**
         * Access the collection of interpolation points
         *
         * @returns {Array<IKnot>} Array of knots or interpolation points
         */
        get: function () {
            var knotArr = new Array();
            var i = 0;
            while (i < this._knots) {
                knotArr.push({ x: this._t[i], y: this._y[i] });
                i++;
            }
            return knotArr;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add an interpolation point to the spline
     *
     * @param {number} x x-coordinate of new control point
     *
     * @param {number} y y-coordinate of new control point
     *
     * @returns {nothing} Note that all x-coordinates MUST be in increasing order and the coordinate order will
       * be dynamically adjusted to ensure this condition
     */
    TSMT$CubicSpline.prototype.addInterpolationlPoint = function (x, y) {
        this._invalidate = true;
        var i = 0;
        if (this._t.length == 0) {
            this._t.push(x);
            this._y.push(y);
        }
        else {
            // find the correct interval for insertion
            if (x > this._t[this._knots - 1]) {
                this._t.push(x);
                this._y.push(y);
            }
            else if (x < this._t[0]) {
                this._t.splice(0, 0, x);
                this._y.splice(0, 0, y);
            }
            else {
                if (this._knots > 1) {
                    i = 0;
                    while (i < this._knots - 1) {
                        if (x > this._t[i] && x < this._t[i + 1]) {
                            this._t.splice(i + 1, 0, x);
                            this._y.splice(i + 1, 0, y);
                            break;
                        }
                        i++;
                    }
                }
            }
        }
        this._knots++;
    };
    /**
     * Clear the spline and prepare for new data
     *
     * @returns {nothing}
     */
    TSMT$CubicSpline.prototype.clear = function () {
        this._t.length = 0;
        this._y.length = 0;
        this._u.length = 0;
        this._v.length = 0;
        this._h.length = 0;
        this._b.length = 0;
        this._z.length = 0;
        this._hInv.length = 0;
        this._knots = 0;
        this._invalidate = true;
    };
    /**
     * Compute the spline y-coordinate for a given x-coordinate
     *
     * @param {number} x x-coordinate in the domain of the spline
     *
     * @returns {number} Value of the natural cubic spline at the provided x-coordinate provided that the coordinate
       * is in-range
     */
    TSMT$CubicSpline.prototype.getY = function (x) {
        if (this._knots == 0) {
            // empty spline returns zero by definition
            return 0;
        }
        else if (this._knots == 1) {
            // this is easy - nothing to interpolate :)
            return this._y[0];
        }
        else {
            // lazy validation used for z-values for performance reasons
            if (this._invalidate) {
                this._computeZ();
            }
            // determine interval - TODO make this more DRY
            var i = 0;
            var j = this._knots - 2;
            var delta = x - this._t[0];
            while (j >= 0) {
                if (x >= this._t[j]) {
                    delta = x - this._t[j];
                    i = j;
                    break;
                }
                j--;
            }
            var b = (this._y[i + 1] - this._y[i]) * this._hInv[i] - this._h[i] * (this._z[i + 1] + 2.0 * this._z[i]) * this.ONE_SIXTH;
            var q = 0.5 * this._z[i] + delta * (this._z[i + 1] - this._z[i]) * this.ONE_SIXTH * this._hInv[i];
            var r = b + delta * q;
            return this._y[i] + delta * r;
        }
    };
    /**
     * Compute the first-derivative of the cubic spline at the specified x-coordinate
     *
     * @param {number} x x-coordinate in the domain of the spline
     *
     * @returns {number} dy/dx, provided the x-coordinate is in-range
     */
    TSMT$CubicSpline.prototype.getYPrime = function (x) {
        // The usual suspects ... TODO Make this more DRY
        if (this._knots == 0) {
            // again, by definition
            return 0;
        }
        else if (this._knots == 1) {
            // a singleton point has no delta-x
            return this._y[0];
        }
        if (this._invalidate) {
            this._computeZ();
        }
        // determine interval
        var i = 0;
        var delta = x - this._t[0];
        var delta2 = this._t[1] - x;
        var j = this._knots - 2;
        while (j >= 0) {
            if (x >= this._t[j]) {
                delta = x - this._t[j];
                delta2 = this._t[j + 1] - x;
                i = j;
                break;
            }
            j--;
        }
        // this can be made more efficient - will complete l8r - the equations can be found in the white paper
        var h = this._h[i];
        var h2 = 1 / (2.0 * h);
        var h6 = h / 6;
        var a = delta * delta;
        var b = delta2 * delta2;
        var c = this._z[i + 1] * h2 * a;
        c -= this._z[i] * h2 * b;
        c += this._hInv[i] * this._y[i + 1];
        c -= this._z[i + 1] * h6;
        c -= this._y[i] * this._hInv[i];
        c += h6 * this._z[i];
        return c;
    };
    /**
       * compute z-values or second-derivative values at the interpolation points.
       *
     * @returns {nothing}
     *
       * @private
     */
    TSMT$CubicSpline.prototype._computeZ = function () {
        // pre-generate h^-1 since the same quantity could be repeatedly calculated in eval()
        var i = 0;
        while (i < this._knots - 1) {
            this._h[i] = this._t[i + 1] - this._t[i];
            this._hInv[i] = 1.0 / this._h[i];
            this._b[i] = (this._y[i + 1] - this._y[i]) * this._hInv[i];
            i++;
        }
        // recurrence relations for u(i) and v(i) -- tri-diagonal solver
        this._u[1] = 2.0 * (this._h[0] + this._h[1]);
        this._v[1] = 6.0 * (this._b[1] - this._b[0]);
        i = 2;
        while (i < this._knots - 1) {
            this._u[i] = 2.0 * (this._h[i] + this._h[i - 1]) - (this._h[i - 1] * this._h[i - 1]) / this._u[i - 1];
            this._v[i] = 6.0 * (this._b[i] - this._b[i - 1]) - (this._h[i - 1] * this._v[i - 1]) / this._u[i - 1];
            i++;
        }
        // compute z(i)
        this._z[this._knots - 1] = 0.0;
        i = this._knots - 2;
        while (i >= 1) {
            this._z[i] = (this._v[i] - this._h[i] * this._z[i + 1]) / this._u[i];
            i--;
        }
        this._z[0] = 0.0;
        this._invalidate = false;
    };
    return TSMT$CubicSpline;
}());
exports.TSMT$CubicSpline = TSMT$CubicSpline;
