// Extract the information required to generate a collaboration graph, where nodes represent
// participants (the bigger the more message s/he has sent) and edges connect nodes/participants
// who have communicated each other (the thicker the edge the higher the number of messages 
// between them).
// 
// The current implementation supports the extraction of collaboration graphs from UOC's forum
// format.
//

// Main variables to keep the nodes (authors) and edges (interactions)
// Authors are kept in a map where the key is the author's name (unique?) and the value 
// is the number of message such author has sent to the forum
authors = {};
// Interaction (edges or messages between authors) is an array which holds the objects for each
// one (with source and target properties to comply with D3, see below)
interactions = [];

// We keep the last messages to check if they are the parent
possibleParents = [];

// Analyze the set of messages in a page of UOC's forums
// Receives the set of items, each one representing a message
function analyzeMessages(items) {
  // We iterate over the messages
  for (i = 0; i < items.length; i++) {
    item = items[i];

    // Checking parent
    // We go up in the list of parents (the loop is done in a reverse way) to look forf the first
    // parent. If we find it, we create an interaction (i.e., edge)
    for(j = possibleParents.length-1; j >= 0; j--) {
      parent = possibleParents[j]
      if(parent.contains(item)) {
        //console.log(parent.querySelector(".msg-author").innerHTML + " -> " + item.querySelector(".msg-author").innerHTML);
        parentName = parent.querySelector(".msg-author").innerHTML;  // The parent name
        childName = item.querySelector(".msg-author").innerHTML      // The child name
        interactions.push({                                          // Creating the edge
          source: parentName, target: childName,                     // These properties are compulsory for D3
          sourceName : parentName, targetName : childName });        // I keep this for me :)
        break;
      }
    }

    // We get the message author name and check if we have found it before
    author = item.querySelector(".msg-author").innerHTML;
    if(authors[author]) {
      authors[author] = authors[author] + 1; // Found before, we increase the number of times found
    } else {
      authors[author] = 1;                   // First time found, we initialize with size 1 (i.e., 1 message)
    }
    
    // Registering the node to check parents in the future
    possibleParents.push(item);
  }
}
    
// This function is used as observer to be called when changes in the DOM are made
// We use it to call analyzeMessages and populate nodes/interactions each time the DOM is updated, 
// which is done when a new page of the forum is shown
function callback (mutations) {
  for (let mutation of mutations) {
    // We only listen mutations regarding childlist changes (i.e., changes in the childs of the observed node)
    if (mutation.type === 'childList' && mutation.removedNodes != undefined && mutation.removedNodes.length > 0) {
      // This is UOC's specifics: the list of messages has been updated (and finished) once the spinner animation disappear
      if(mutation.removedNodes[0].classList != undefined && mutation.removedNodes[0].classList.contains("spinner")) {
        // We recover the new set of messages and populate the graph
        items = document.querySelectorAll(".inner-left-component .msg-item");
        analyzeMessages(items);

        // Checking if there are more pages in the forum
        next = document.querySelectorAll(".lnk-next-page")[0];
        if(!next.parentNode.classList.contains("disabled"))
          next.click();  // if so, we click on the next button
        else {
          showResults(); // if not, we show results
        }
      }
    }
  }
}

// Once the forum has been analyzed, we have to show the results
// We notify the plugin via messaging
function showResults() {
  // console.log(authors);
  // console.log(interactions);
  // We first stop listening changes
  observer.disconnect();
  // Converting authors to D3 format
  nodes = [];
  for(author in authors) {
    nodes.push({ "id" : author, "name" : author, "size" : authors[author]});
  }
  // Sending the message
  chrome.runtime.sendMessage({ type: "graph", nodes : nodes, edges : interactions});
}

isGithub = document.querySelectorAll(".repository-content");
if(isGithub[0] == undefined) {

// Main execution of the extractor
// We first look for the message tree of the website
panel = document.querySelectorAll("#msgs-tree");
//console.log(panel);
if(panel == undefined || panel.length == 0) {
  // If we don't find the message tree, we assume we are NOT in a forum-like UOC website
  // We notify via message and stop
  chrome.runtime.sendMessage({ type: "message", message : "No messages detected, are you in a forum?"});
} else {
  // We found the message tree and start the extraction process
  // We first register a listener/observer for changes in the message tree
  observer = new MutationObserver(callback);
  observer.observe(panel[0], { childList: true }); // only childList changes

  // We locate the go-to-first-page in the forum to collect all the message
  goFirstPage = document.querySelectorAll(".lnk-first-page")[0];
  if(goFirstPage.parentNode.classList.contains("disabled")) {
    // If we are already in the first page we recover all the messages...
    items = document.querySelectorAll(".inner-left-component .msg-item");
    // ...and analyze them
    analyzeMessages(items);

    // Checking if there are more pages in the forum
    next = document.querySelectorAll(".lnk-next-page")[0];
    if(!next.parentNode.classList.contains("disabled")) {
      next.click();  // if so, we click on the next button
    } else {
      showResults(); // if not, we show results
    }
  } else {
    // If we are NOT in the first page, we click on the go-to-first-page button
    // This will trigger the observer created before and therefore starts the extraction process
    goFirstPage.click();
  }
}

} else {

//
// GITHUB TESTING
//
  issues = document.querySelectorAll(".js-issue-row");
  nodes = [];

  for(i = 0; i < issues.length; i++) {
    issue = issues[i];
    author = issue.querySelector(".opened-by").querySelector(".muted-link").innerHTML;

    if(authors[author]) authors[author] = authors[author] + 1; 
    else authors[author] = 1;                   

    issue = "Issue " + issue.querySelector(".opened-by").innerHTML.trim().substring(1, 4).trim();
    nodes.push({ "id" : issue, "name" : issue, "size" : 1, "color" : "#000078"});


    interactions.push({                                         
          source: author, target: issue,                
          sourceName : author, targetName : issue });   
  }

  for(author in authors) {
    nodes.push({ "id" : author, "name" : author, "size" : authors[author], "color" : "#73edff"});
  }

  // Sending the message
  chrome.runtime.sendMessage({ type: "graph", nodes : nodes, edges : interactions});

}

