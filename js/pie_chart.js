let svgWidth = 450;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3.select("#pie_chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

