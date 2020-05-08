chrome.runtime.sendMessage({type : "request", need : "graph"}, function callback(message) {
  //drawGraph(message.graph.nodes, message.graph.edges);
});

function update(graph) {
  drawGraph(graph.nodes, graph.edges);
  updateParticipantsTable(graph.nodes);
}

// GRAPH DRAWING
// We rely on D3 to render the graph. The following is therefore the typical force-directed graph
// implementation in D3. The nodes and edges received have to follow the D3 expected format, thatis:
//   nodes : [ { id : "", name : "", size : "" },... ],
//   edges : [ { source : "", target : ""}, ... ]
// The graph is drawn in #d3graph div element of the plugin popup
function drawGraph(nodes, edges) {
  d3.selectAll("svg").remove;  // cleaning svg element

  // The margins. No need (yet) to make these values as global variables.
  var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 1108 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // Appending the svg object to the body of the page
  var svg = d3.select("#d3graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

  // Separating the main group to enable zooming (see zoomHandler)
  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var zoomHandler = d3.zoom()
      .on("zoom", function(d) { g.attr("transform", d3.event.transform)} );
  zoomHandler(svg);

  // Gathering main data
  var data = {
    nodes : nodes,
    links : edges
  }

  // Creating the linear scale to distribute the size of the nodes
  var nodeSizeScale = d3.scaleLinear();
  nodeSizeScale
      .domain([0, d3.max(data.nodes, n => n.size)])
      .range([5, 50]);

  // The edges of the graph
  // Color is hardcoded
  var link = g
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .style("stroke", "#aaa")

  // The nodes of the graph
  // Color and stroke are hardcoded. The size is calculated according to the previous scale
  // Added support for drag&drop
  var node = g
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", d => nodeSizeScale(d.size))
      .style("fill", function(d) { if(d.color == undefined) return "#73edff"; else return d.color})
      .style("stroke", "#000078")
      .call(d3.drag()
          .on("start", function(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag",  function(d) { d.fx = d3.event.x; d.fy = d3.event.y; })
          .on("end",   function(d) { if (!d3.event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));


  // Decorating each node with a title, which includes the name of the node and the number of
  // messages (i.e., the size of the node)
  node.append("title")
      .text(d => d.name + " (" + d.size + " message/s)");

  // Main force-directed algorithm of D3 to render the graph
  var simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink()
          .id(d => d.id)
          .links(data.links)
      )
      .force("charge", d3.forceManyBody().strength(0).distanceMax(250))  // Max distance allowed between nodes
      .force("center", d3.forceCenter(width / 2, height / 2))            // Forcing the graph to be shown in the center
      .force('collision', d3.forceCollide().radius(function(d) {         // Forcing nodes to collide (not overlap) but
        return nodeSizeScale(d.size)+25                                  // at radius+25 distance :)
      }))
      .on("tick", ticked)

  // Each iteration of the graph moves the nodes/links so we update them
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }
}


// UPDATING THE NODES TABLE (PARTICIPANTS TABLE)
// We rely on D3 function to make it easier
function updateParticipantsTable(nodes) {
  var tr = d3.select(".participantsTable").select("tbody").selectAll("tr")
      .data(nodes)
      .enter().append("tr");

  var col1 = tr.append("td").text(d => d.name).style("width", "550px");
  var col2 = tr.append("td").text(d => d.outDegree).style("width", "100px").style("text-align", "center");
  var col3 = tr.append("td").text(d => d.inDegree).style("width", "100px").style("text-align", "center");
  var col4 = tr.append("td").text(d => d.responseTimeMin).style("width", "100px").style("text-align", "center");
  var col4 = tr.append("td").text(d => d.responseTimeMax).style("width", "100px").style("text-align", "center");
  var col4 = tr.append("td").text(d => d.responseTimeMean).style("width", "100px").style("text-align", "center");
}

// JUST FOR DEBUG
var nodes = [
  { "id" : "A", "name" : "A", "size" : 2, "inDegree" : 1, "outDegree" : 4, "responseTimeMin" : "01d 03h 03m 00s", "responseTimeMax" : "02d 03h 03m 00s", "responseTimeMean" : "0d 08h 23m 12s"},
  { "id" : "B", "name" : "B", "size" : 2, "inDegree" : 4, "outDegree" : 8, "responseTimeMin" : "01d 07h 03m 00s", "responseTimeMax" : "05d 03h 03m 00s", "responseTimeMean" : "0d 07h 33m 33s"},
  { "id" : "C", "name" : "C", "size" : 3, "inDegree" : 6, "outDegree" : 2, "responseTimeMin" : "00d 12h 23m 23s", "responseTimeMax" : "03d 04h 06m 00s", "responseTimeMean" : "0d 02h 43m 32s"},
  { "id" : "D", "name" : "D", "size" : 4, "inDegree" : 2, "outDegree" : 6, "responseTimeMin" : "00d 21h 04m 23s", "responseTimeMax" : "02d 03h 03m 00s", "responseTimeMean" : "0d 04h 02m 16s"},
  { "id" : "E", "name" : "E", "size" : 2, "inDegree" : 2, "outDegree" : 3, "responseTimeMin" : "00d 04h 05m 31s", "responseTimeMax" : "07d 00h 13m 00s", "responseTimeMean" : "0d 04h 13m 23s"}
];

var edges = [
  { "source" : "A", "target" : "B"},
  { "source" : "A", "target" : "C"},
  { "source" : "A", "target" : "D"},
  { "source" : "A", "target" : "E"},
  { "source" : "B", "target" : "D"},
  { "source" : "C", "target" : "E"},
];

var graph = { nodes : nodes, edges : edges};
update(graph);