"use strict";
/** Copyright 2018 Jim Armstrong (www.algorithmist.net)
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
// Specs for Typescript Math Toolkit Natural Cubic Spline
// test functions/classes
var CubicSpline_1 = require("../src/CubicSpline");
var Chai = require("chai");
var expect = Chai.expect;
// Test Suites
describe('Natural Cubic Spline: TSMT$CubicSpline', function () {
    var spline = new CubicSpline_1.TSMT$CubicSpline();
    // sample data
    var dataX = new Array();
    var dataY = new Array();
    dataX.push(0.0);
    dataY.push(0.8);
    dataX.push(6);
    dataY.push(-0.34);
    dataX.push(15);
    dataY.push(0.59);
    dataX.push(17);
    dataY.push(0.59);
    dataX.push(19);
    dataY.push(0.23);
    dataX.push(21);
    dataY.push(0.1);
    dataX.push(23);
    dataY.push(0.28);
    dataX.push(26);
    dataY.push(1.03);
    dataX.push(28);
    dataY.push(1.5);
    dataX.push(30);
    dataY.push(1.44);
    dataX.push(36);
    dataY.push(0.74);
    dataX.push(47);
    dataY.push(-0.82);
    dataX.push(52);
    dataY.push(-1.27);
    dataX.push(57);
    dataY.push(-0.92);
    dataX.push(58);
    dataY.push(-0.92);
    dataX.push(60);
    dataY.push(-1.04);
    dataX.push(64);
    dataY.push(-0.79);
    dataX.push(69);
    dataY.push(-0.16);
    dataX.push(76);
    dataY.push(1.0);
    dataX.push(80);
    dataY.push(0.0);
    it('properly constructs a new cubic spline', function () {
        expect(spline.knotCount).to.equal(0);
        expect(spline.interpolationPoints.length).to.equal(0);
        expect(spline.getY(0)).to.equal(0);
    });
    it('works with a singleton interpolation point', function () {
        spline.addInterpolationlPoint(0, 1);
        expect(spline.knotCount).to.equal(1);
        expect(spline.interpolationPoints.length).to.equal(1);
        expect(spline.getY(0)).to.equal(1);
    });
    it('clear test', function () {
        spline.addInterpolationlPoint(1, 2);
        expect(spline.knotCount).to.equal(2);
        spline.clear();
        expect(spline.knotCount).to.equal(0);
        expect(spline.interpolationPoints.length).to.equal(0);
        expect(spline.getY(1)).to.equal(0);
    });
    it('multi-point, returns correct interpolation points', function () {
        spline.clear();
        var n = dataX.length;
        var i;
        for (i = 0; i < n; ++i) {
            spline.addInterpolationlPoint(dataX[i], dataY[i]);
        }
        expect(spline.knotCount).to.equal(n);
        var points = spline.interpolationPoints;
        expect(points.length).to.equal(n);
        expect(points[0].x).to.equal(dataX[0]);
        expect(points[0].y).to.equal(dataY[0]);
        expect(points[n - 1].x).to.equal(dataX[n - 1]);
        expect(points[n - 1].y).to.equal(dataY[n - 1]);
    });
    it('multi-point, interpolates exactly at knots', function () {
        spline.clear();
        var n = dataX.length;
        var i;
        for (i = 0; i < n; ++i) {
            spline.addInterpolationlPoint(dataX[i], dataY[i]);
        }
        expect(spline.knotCount).to.equal(n);
        var points = spline.interpolationPoints;
        expect(points.length).to.equal(n);
        for (i = 0; i < n; ++i) {
            expect(Math.abs(dataY[i] - spline.getY(dataX[i])) < 0.001).to.be.true;
        }
    });
    it('multi-point, interpolate in-between knots test', function () {
        spline.clear();
        var n = dataX.length;
        var i;
        for (i = 0; i < n; ++i) {
            spline.addInterpolationlPoint(dataX[i], dataY[i]);
        }
        expect(spline.knotCount).to.equal(n);
        var y = spline.getY(1.0);
        expect(Math.abs(y - 0.54) < 0.01).to.be.true;
        y = spline.getY(8.0);
        expect(Math.abs(y + 0.306) < 0.01).to.be.true;
        y = spline.getY(15.0);
        expect(Math.abs(y - 0.59) < 0.01).to.be.true;
        y = spline.getY(28.0);
        expect(Math.abs(y - 1.5) < 0.01).to.be.true;
        y = spline.getY(35.0);
        expect(Math.abs(y - 0.868) < 0.01).to.be.true;
        y = spline.getY(45.0);
        expect(Math.abs(y + 0.531) < 0.01).to.be.true;
        y = spline.getY(60.0);
        expect(Math.abs(y + 1.04) < 0.01).to.be.true;
        y = spline.getY(70.0);
        expect(Math.abs(y - 0.061) < 0.01).to.be.true;
    });
});
