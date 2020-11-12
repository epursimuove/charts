# charts

Simple chart functionality in JavaScript.

Using [chartjs.org](https://www.chartjs.org) as a way of creating dynamic content with different types of charts.

There are default values for most configuration parameters.




## Background

The project started in May 2020.


## Files

The project consist of the following files:

```
.
├── LICENSE
├── README.md
├── example.html
└── js
    ├── charts.js
    ├── data.js
    ├── example.js
    └── structuredData.js
```

The *important* file is `charts.js`. The other files are for documentation and help.

The `example.html` file is published as [Charts examples](http://anders.nemonisimors.com/projects/charts/example.html), so you can have a look at what it may look like.


## Installing

You will need to include the `charts.js` file in your HTML `head` section. You will also need the `Chart.js` functionality provided by www.chartjs.org.

```html
<head>
    ...
    <!-- The Chart.js from https://www.chartjs.org. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>

    <script type="text/javascript"
            src="js/charts.js"></script>
    ...
</head>
```


## Documentation








### Different charts

The following types are implemented at the moment:
- Bar
  - Vertical
    - Stacked
    - Grouped
  - Horizontal
- Line
    - Time
- Pie
- Bubble



#### Bar charts

The horizontal bar chart is great when you have data with large differences between min and max and/or few values. The vertical bar chart is great when you have "compact" values and/or many values.

Note: This is when you are in landscape mode, so of course, in portrait mode it will be the other way around.



### Configuration

An example of how you can configure a vertical bar chart showing the frequencies for dice throws.

From `example.html`:

```html
<canvas id="dicesChart" width="1600" height="200"></canvas>
```

From `example.js`:

```javascript
nnmCharts.verticalBarChart({
    canvasId: 'dicesChart',
    title: `Frequency for ${dices.totalThrows} dice throws`,
    xAxesLabel: 'Dice face',
    yAxesLabel: 'Frequency',
    labels: dices.faces,
    datasets: [
        {
            label: 'Frequency',
            data: dices.frequencies
        }
    ]
});
```

The dices object is built in the following way.

From `data.js`:

```javascript
const diceData = [
    {frequency: 56, face: 'I'},
    {frequency: 49, face: 'II'},
    {frequency: 39, face: 'III'},
    {frequency: 61, face: 'IV'},
    {frequency: 44, face: 'V'},
    {frequency: 51, face: 'VI'}
];
```

From `structuredData.js`:

```javascript
const dices = {
    totalThrows: diceData.map(dice => dice.frequency).reduce((a, b) => a + b, 0),
    faces: diceData.map(dice => dice.face),
    frequencies: diceData.map(dice => dice.frequency)
};
```




#### Mandatory

**canvasId** - decides which canvas in the HTML page that the chart should use.

**labels** - the labels

**datasets** - may have different structures depending on type of chart.
 


#### Optional

**title** - an optional title.

**xAxesLabel** and **yAxesLabel** - enhancing descriptions for the axes.

**yLabels** - used by time charts.

**colors** - using your own colors, instead of the predefined.

**fillViewportFactor** - if `0 < fillViewportFactor ≤ 1`, the canvas used for the chart, will use the maximum width of the current viewport and the maximum height multiplied with `fillViewportFactor`, regardless if portrait or landscape mode.


## Examples

You can see more examples in the `example.html` and `example.js` files. You can see the result at [Chart examples](http://anders.nemonisimors.com/projects/charts/example.html).














*Nemo nisi mors*