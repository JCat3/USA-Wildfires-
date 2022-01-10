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
                yAxisID: 'acres'
            }, {
                label: "Average Precipitation (mm)",
                data: precip,
                backgroundColor: ['rgba(0,26,104,0.2)'],
                borderColor: ['rgba(0,26,104,1)'],
                borderWidth: 1,
                xAxisID: 'mm'
            }]
        };

        const config = {
            type: 'line',
            data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Acres Burned and Average Rainfall per Year'
                    }
                },
                responsive: true,
                scales: {
                    acres: {
                        beginAtZero: true,
                        type: 'linear',
                        position: 'left',
                        suggestedMin: 0,
                        ticks: {
                            callback: function(value, index, values) {
                                return `${value} acres`;
                            }
                        }
                    },
                    mm: {
                        beginAtZero: true,
                        type: 'linear',
                        position: 'right',
                        suggestedMin: 0,
                        ticks: {
                            callback: function(value, index, values) {
                                return `${value} mm`;
                            }
                        }
                    }
                }
            }
        };

        const myChart = new Chart (
            document.getElementById('myChart'),
            config
        );

    }); 

}

drawLine();