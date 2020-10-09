function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesResultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesResultArray[0];
//console.log(samplesResultArray);
//console.log(samplesResult);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = samplesResult.otu_ids;
    var otuLabels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;
//console.log(otuID);
//console.log(otuLabels);
//console.log(sampleValues);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var top10 = otuID.slice(0,10);
    var top10flip = top10.sort((a,b) => b.otuID - a.otuID).reverse();
    var yticks = top10flip.map(i => "OTU " + i);
console.log(top10);
console.log(yticks);    
var top10Values = sampleValues.slice(0,10);
var top10ValuesFlip = top10Values.sort((a,b) => b.sampleValues - a.sampleValues).reverse();
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: top10ValuesFlip,
      y: yticks, 
      type: 'bar',
      orientation: 'h',
      text: otuLabels
    };
    var barData = [trace];
console.log(barData);
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    // 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot("bar-plot", barData, barLayout);


// 1. Create the trace for the bubble chart.
var trace = {
  x: otuID,
  y: sampleValues,
  text: otuLabels,
  mode: 'markers',
  marker: {
    color: otuID,
    size: sampleValues
  }
};
var bubbleData = [trace];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: 'Bacteria Cultures Per Sample',
  showlegend: false,
  hovermode: 'closest',
  xaxis: otuLabels
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot('bubble', bubbleData, bubbleLayout);

//Gauge
var wmetadata = data.metadata;
var washResultArray = wmetadata.filter(sampleObj => sampleObj.id == sample);
var washResult = washResultArray[0];
//console.log(washResultArray)
  // D2: 3. Use Plotly to plot the data with the layout.
    var washFreq = washResult.wfreq;
//console.log(washFreq)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: {text: "Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10],},
          bar: {color: "black"},
          steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 400, margin: {t: 0, b: 0} 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
