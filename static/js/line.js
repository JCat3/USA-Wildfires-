//animated line chart with fire size, precipitation by date - include 2 axis 
const ctx = document.getElementById("myChart").getContext("2d");

console.log("line.js is loaded")

function drawLine() {
    d3.json("/lineGraph_data").then(yearData => {
        console.log(yearData);

    //map the years to a list
    let years = yearData.map(o => o.Date);
    console.log(years)

    //map the fire size to a list
    let fire_size = yearData.map(o => o.Fire_Size);
    console.log(fire_size);

    let precip = yearData.map(o => o.Precipitation);
    console.log(precip);

    const labels = years;

    const data = {
        labels,
        datasets: [
            {
                data: fire_size,
                label: "Fire Size",
            },
            {
                data2: precip,
                label2: "Precipitation",
            }
        ],
    }

    // insert animation documentation from chartjs
    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }   
    };

// start animate line chart with documentation from chartjs.org
    const config = {
        type: 'line',
        data: {
          datasets: [{
            borderColor: 'red',
            borderWidth: 1,
            radius: 0,
            data: fire_size,
          },
          {
            borderColor: 'blue',
            borderWidth: 1,
            radius: 0,
            data: precip,
          }]
        },
        options: {
          animation,
          interaction: {
            intersect: false
          },
          plugins: {
            legend: false
          },
          scales: {
            x: {
              type: 'linear'
            }
          }
        }
      };

    });
}

drawLine();