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