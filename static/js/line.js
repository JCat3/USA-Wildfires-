const ctx = document.getElementById("myChart").getContext("2d");

console.log("line2.js is loaded")

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
            labels: labels,
            datasets: [{
                label: "Total Acres Burned",
                data: fire_size,
                backgroundColor: ['rgba(255,26,104,0.2)'],
                borderColor: ['rgba(255,26,104,1)'],
                borderWidth: 1,
                yAxisID: 'acres',
            },{
                label: "Average Precipitation (mm)",
                data: precip,
                backgroundColor: ['rgba(0,26,104,0.2)'],
                borderColor: ['rgba(0,26,104,1)'],
                borderWidth: 1,
                yAxisID: 'mm',
            }]
        };

        const totalDuration = 10000;
        const delayBetweenPoints = totalDuration / precip.length;
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

        const config = {
            type: 'line',
            data,
            //     datasets: [{
            //         label: "Total Acres Burned",
            //         data: fire_size,
            //         backgroundColor: ['rgba(255,26,104,0.2)'],
            //         borderColor: ['rgba(255,26,104,1)'],
            //         borderWidth: 1,
            //         yAxisID: 'acres'
            //     }, {
            //         label: "Average Precipitation (mm)",
            //         data: precip,
            //         backgroundColor: ['rgba(0,26,104,0.2)'],
            //         borderColor: ['rgba(0,26,104,1)'],
            //         borderWidth: 1,
            //         xAxisID: 'mm'
            //     }]
            // },
            options: {
                // animation,
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Acres Burned and Average Rainfall per Year'
                    }
                },
                responsive: true,
                scales: {
                    yAxis: [{
                        id: 'acres',
                        beginAtZero: true,
                        type: 'linear',
                        position: 'left',
                        suggestedMin: 0,
                        ticks: {
                            callback: function(value) {
                                return `${value} acres`;
                            }
                        }
                    },{
                        id: 'mm',
                        beginAtZero: true,
                        type: 'linear',
                        position: 'right',
                        suggestedMin: 0,
                        ticks: {
                            callback: function(values) {
                                return `${values} mm`;
                            }
                        }
                    }]
                }
            }
        };

        const myChart = new Chart (ctx, 
            config
        );

    }); 

}

drawLine();