// Pie chart - causes with dropdown menu 

//imports



console.log("pie chart is loaded")




// Initialize Dropdown Menu

let selector = d3.select("selDataset")

d3.json("/pie_data").then(data => {
    console.log(data)


    data.array.forEach(state => {
        selector.append("option")
        .text(state)
        .property("value", state)
    });      
   

}
);


