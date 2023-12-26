// Load data from the provided URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(data => {
    // Assuming your data structure has a property named 'names' for dropdown options
    var dropdownOptions = data.names;

    // Populate the dropdown menu with options
    d3.select("#selDataset")
      .selectAll("option")
      .data(dropdownOptions)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);

    // Call updateChart() initially with the first sample
    updateChart(dropdownOptions[0]);
  })
  .catch(error => console.log(error));

// Event listener for dropdown change
d3.select("#selDataset").on("change", function () {
  var selectedSample = d3.select(this).property("value");
  updateChart(selectedSample);
});

// Function to update the chart based on the selected sample
function updateChart(selectedSample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(data => {
      // Assuming your data structure has properties like 'sample_values', 'otu_ids', 'otu_labels'
      var selectedData = data.samples.find(sample => sample.id === selectedSample);

      // Select the top 10 OTUs
      var topOTUs = selectedData.otu_ids.slice(0, 10);
      var topValues = selectedData.sample_values.slice(0, 10);
      var topLabels = selectedData.otu_labels.slice(0, 10);

      // Create a horizontal bar chart
      var trace1 = {
        type: 'bar',
        x: topValues,
        y: topOTUs.map(otu => `OTU ${otu}`),
        text: topLabels,
        orientation: 'h'
      };

      var layout1 = {
        title: `Top 10 OTUs for ${selectedSample}`,
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
      };

      // Plot the bar chart
      Plotly.newPlot('bar', [trace1], layout1);

      // Create a bubble chart
      var trace2 = {
        type: 'scatter',
        mode: 'markers',
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        marker: {
          size: selectedData.sample_values,
          color: selectedData.otu_ids,
          colorscale: 'Viridis'
        },
        text: selectedData.otu_labels
      };

      var layout2 = {
        title: `Bubble Chart for ${selectedSample}`,
        xaxis: { title: 'OTU IDs' },
        yaxis: { title: 'Sample Values' }
      };

      // Plot the bubble chart
      Plotly.newPlot('bubble', [trace2], layout2);

      // Create a gauge chart
      var trace3 = {
          type: "indicator",
          mode: "gauge+number+delta",
          value: selectedData.sample_values,
          title: { text: "Scrubs per Week", font: {size:14} },
          gauge: {
            axis: { range: [0, 9]},
            borderwidth: 0,
            steps: [
              { range: [0, 1], color: "f8f3eb", text: "0-1" },
              { range: [1, 2], color: "f5f1e5", text: "1-2" },
              { range: [2, 3], color: "e9e7c9", text: "2-3" },
              { range: [3, 4], color: "e5e8b0", text: "3-4" },
              { range: [4, 5], color: "d5e59a", text: "4-5" },
              { range: [5, 6], color: "b7cd90", text: "5-6" },
              { range: [6, 7], color: "8ac085", text: "6-7" },
              { range: [7, 8], color: "88bb8d", text: "7-8" },
              { range: [8, 9], color: "84b488", text: "8-9" },
            ],
            threshold: {
              line: { color: "transparent", width:0 },
              thickness: 0,
              value: 9
            },
            textinfo: "label",  
            textposition: "inside",  
            delta: {
              reference: 5,
              increasing: { color: "red" },
              line: { color: "red", width: 10 },  
              fill: { color: "red" }  
            },
            shape: "angular",  
          },
      };
      
      var layout3 = {
        title: `Belly Button Washing Frequency`, 
      };
      
      // Plot the gauge chart
      Plotly.newPlot('gauge', [trace3], layout3);

      // Display metadata
      displayMetadata(data.metadata.find(item => item.id === parseInt(selectedSample)));
    })
    .catch(error => console.log(error));
}

// Function to display metadata
function displayMetadata(metadata) {
  // Assuming you have a div with the id 'metadataDisplay' for displaying metadata
  var metadataDisplay = d3.select("#metadataDisplay");

  // Clear previous metadata
  metadataDisplay.html("");

  // Iterate through key-value pairs and append to the display
  Object.entries(metadata).forEach(([key, value]) => {
    metadataDisplay.append("p").text(`${key}: ${value}`);
  });
}