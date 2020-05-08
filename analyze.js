chrome.runtime.sendMessage({type : "request", need : "graph"}, function callback(message) {
  //drawGraph(message.graph.nodes, message.graph.edges);
});

function update(graph) {
  drawGraph(graph.nodes, graph.edges);
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

// JUST FOR DEBUG
var nodes = [
  { "id" : "A", "name" : "A", "size" : 2},
  { "id" : "B", "name" : "B", "size" : 2},
  { "id" : "C", "name" : "C", "size" : 3},
  { "id" : "D", "name" : "D", "size" : 4},
  { "id" : "E", "name" : "E", "size" : 2}
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