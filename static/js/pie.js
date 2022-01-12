// Pie chart - causes with dropdown menu 

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
        textinfo: 'none',
        type: 'pie',
        hole: .65,
        text: state,
        textposition: 'inside'
      }];
      
      getStateName = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AR": "Arkansas",
        "AZ": "Arizona",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "IA": "Iowa ",
        "ID":"Idaho",
        "IL":"Illinois",
        "IN":"Indiana",
        "KS":"Kansas City",
        "KY":"Kentuck",
        "LA":"Louisiana",
        "MA":"Massachussets",
        "MD":"Maryland",
        "ME":"Maine",
        "MI":"Michigian",
        "MN":"Minnesota",
        "MO":"Missouri",
        "MS":"Mississipi",
        "MT":"Montana",
        "NC":"North Carolina",
        "ND":"North Dakota",
        "NE":"Nebraska",
        "NH":"New Hampshires",
        "NJ":"New Jersey",
        "NM":"New Mexico",
        "NV":"Nevada",
        "NY":"New York",
        "OH":"Ohio",
        "OK":"Oklahoma",
        "OR":"Oregon",
        "PA":"Pennsylvania",
        "PR":"Puerto Rico",
        "RI":"Rhode Island",
        "SC":"South Carolina",
        "SD":"South Dakota",
        "TN":"Tennessee",
        "TX":"Texas",
        "UT":"Utah",
        "VA":"Virginia",
        "VT":"Vermont",
        "WA":"Washington",
        "WI":"Wisconsin",
        "WV":"Westy Virginia",
        "WY":"Wyoming",
    };

      stateName = getStateName[state];

      let layout = {
        title: {
          text:`Wildfire Causes in ${stateName}`,
          font: {
            family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            size: 24,
            color: "white"
          }
        },
        height: 400,
        width: 700,
        paper_bgcolor:'rgba(54, 53, 53, 0.973)',
        font: {
          color: 'white'
        },
        annotations: [
            {
              font: {
                size: 20,
                color: "white"
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



