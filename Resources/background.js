/**==============================================
 * ?                    ABOUT
 * @author      : Filip Szkandera
 * @thanksto    : Martin Procházka
 * @email       : filip.szkandera@gmail.com
 * @repo        : Ad-Skipper-for-YouTube-Chrome
 * @createdOn   : 15.10.2023
 * @description : Ad skipper Background Handler
 *=============================================**/

async function handleUpdated(tabId, changeInfo, tabInfo) {
//   console.log(`Updated tab: ${tabId}`);
//   console.log("Changed attributes: ", changeInfo);
//   console.log("New tab Info: ", tabInfo);
    
    await chrome.tabs.query({active: true, currentWindow: true}, async function(tabs){
        console.log(tabs)
        await chrome.tabs.sendMessage(tabs[0].id, {newpageloaded: true}, function(response) {});
    });

    // console.log("done");
}

chrome.tabs.onUpdated.addListener(handleUpdated);
