// Main background file of the plugin

// We just configure the URL for which the plugin is activated
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules(
      [
        {
          conditions: 
            [
              new chrome.declarativeContent.PageStateMatcher({ 
                pageUrl: { hostEquals: 'cv.uoc.edu'},  // Current support: UOC's forums
              })
            ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]
    );
  });
});

// Main Storage
var graph = { nodes : [], edges : []}

// The background script acts as the main communication commuter
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.type == "store") {                                                              // Graph extracted
            graph = { nodes : message.nodes, edges : message.edges};                                // We store the graph
            chrome.runtime.sendMessage({ type: "graph", graph : graph}); // Communicate to popup
        }
        else if (message.type == "request") {                                                       // There is a request
            if(message.need == "graph") {
                sendResponse({ type: "graph", graph : graph});
            }
        }
    }
);