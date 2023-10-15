async function handleUpdated(tabId, changeInfo, tabInfo) {
  //sendResponse({ farewell: "goodbye" });
  console.log(`Updated tab: ${tabId}`);
  console.log("Changed attributes: ", changeInfo);
  console.log("New tab Info: ", tabInfo);
    
  await chrome.tabs.query({active: true, currentWindow: true}, async function(tabs){
    await chrome.tabs.sendMessage(tabs[0].id, {newpageloaded: "true"}, function(response) {});
    });
    
    console.log("done");
    
}

//browser.tabs.onUpdated.addListener(handleUpdated);
chrome.tabs.onUpdated.addListener(handleUpdated);
