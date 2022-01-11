// Pie chart - causes with dropdown menu 

//imports




console.log("pie.js is loaded")


function drawPie(state) {

    d3.json("/pie_data").then(data => {

    //filter data down to one state only
    let state_filtered = data.filter(s => s.State === state)
   
    //map the causes to a list
    let causes = state_filtered.map(o => o.Cause)
    console.log(causes)

    //map the count to a list
    let counts = state_filtered.map(o => o.Count)
    console.log("counts")
    console.log(counts)

    

    let chart_data = [{
        values: counts,
        labels: causes,
        // domain: {column: 0},
        type: 'pie',
        hole: .4,
        text: state,
        textposition: 'inside',
      }];
      
      let layout = {
        height: 400,
        width: 700,
        annotations: [
            {
              font: {
                size: 20
              },
              showarrow: false,
              text: state,
              x: 0.5,
              y: 0.5
            },
        ],
        // grid: {rows: 1, columns: 1}
        };
      
      Plotly.newPlot("pie_chart", chart_data, layout);
    
    });


}

//call and update drawPie function when a new state is selected

function optionChanged(state) {
    console.log(`State Changed to ${state}`);

    drawPie(state);

}



// Initialize Dropdown Menu

function InitPie(){

    console.log("InitPie has run")
    let selector = d3.select("#selDataset");

    d3.json("/pie_data").then(data => {
        console.log(data)

        let uniqueStates = [...new Set(data.map(o => o.State))]
        console.log(uniqueStates)

        let statesSorted = uniqueStates.sort()

        statesSorted.forEach(state => {
            selector.append("option")
                .text(state)
                .property("value", state);
        });



    let state = uniqueStates[0]
    console.log("initial state")
    console.log(state)
    
    drawPie(state)

    });
}

InitPie();



