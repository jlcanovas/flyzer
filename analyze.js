document.getElementById("holder").innerText = "OK";

chrome.runtime.sendMessage({type : "request", need : "graph"}, function callback(message) {
   console.log(message);
});



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

graph = { nodes : nodes, edges : edges};