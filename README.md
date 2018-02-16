# Typescript Math Toolkit Natural Cubic Spline

Of all my work with various parametric and cartesian curves in computational geometry, the natural cubic spline is probably my favorite.  This spline fits a set of _(x, y)_ coordinates with strictly increasing order of independent variable.  The spline is piecewise cubic, meaning that a separate cubic polynomial is defined for each interval.  It is C-2 continuous, so coordinates, first-, and second-derivatives are matched at interior interpolation points.  Second derivatives are zero at the endpoints.

If you wish more detail on the construction of the spline and want to match variables in the _TSMT$CubicSpline_ class to the mathematical details, then here is a [white paper that I wrote on the topic] back in 2005.

To give you some idea of the longevity of this spline, I've now written/ported it to the following languages:

- Fortran
- C
- C++
- Javascript
- Actionscript
- Typescript

[Here is a blog post] describing one usage of this spline in a data visualization project.

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.4.3

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.


### Usage

Add interpolation points, one-by-one.  The _x_-coordinates should be in increasing order.  If not, intervals are created that preserve increasing order that is required by the spline.

_y_-coordinates and derivative values may be queried for x-coordinates in between the endpoints of the domain.
 
A number of computations are required in the interpolation that remain constant as long as the knots or interpolation points do not change.  Lazy validation is applied to these computations.

Note that the term _knots_ is used interchangeably with interpolation points.  The term _knot_ comes from an ancient shipbuilding technique whereby ropes were hung from a common beam.  Knots were tied along each rope to define a sequence of points that defined a curve that the builder should match for some component of the ship.

The public API of the _TSMT$CubicSpline_ class is currently minimal and I will consider adding new functionality if it is deemed useful for the community.

```
public get knotCount()
public get interpolationPoints(): Array<IKnot>
public addInterpolationlPoint(x: number, y: number): void
public clear()
public getY(x: number): number
public getYPrime(x: number): number

```

Refer to the specs in the _test_ folder for more usage examples.

License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

[white paper that I wrote on the topic]: <http://algorithmist.net/docs/spline.pdf>

[Here is a blog post]: <http://www.algorithmist.net/portfolio/recent-data-visualization-work/>

