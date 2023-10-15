/**==============================================
 * ?                    ABOUT
 * @author      : Filip Szkandera
 * @thanksto    : Martin Procházka
 * @email       : filip.szkandera@gmail.com
 * @repo        : Ad-Skipper-for-YouTube-Chrome
 * @createdOn   : 15.10.2023
 * @description : Ad skipper Handler
 *=============================================**/


// importing constants.js

// Attach listener when page is updated
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.newpageloaded)
    {
        console.log("Disconnecting observer");
        observer.disconnect();
        console.log("Running observer again");
        startObserving();
    }
});


let isGifInserted = false;
let youtubeVideoContainer;


function mutePage(state) {
    var elems = document.querySelectorAll("video, audio");
    Array.from(elems).forEach((elem) => {
        elem.muted = state;
    });
}

let observer = new MutationObserver(mutationRecords => {

    let gifElement;
    
    
    console.log("\r\nLoop:");
    // Mute if there is an add
    //if (typeof document.getElementsByClassName('ytp-ad-player-overlay-instream-info')[0] != 'undefined')
    //{
        //console.log("muted");
        //mutePage(true);
    //}
    
    //console.log(mutationRecords); // console.log(the changes)
    
    // Tries to click on the "Skip Ad"
    try {
        document.getElementsByClassName('ytp-ad-skip-button-text')[0].innerHTML = "Sorry 🥲🥲";
        document.getElementsByClassName('ytp-ad-skip-button-text')[0].click();

        console.log("Skipped ad!");
        
        //console.log("Clicked");
        //console.log("1");
        // Increment 'replacedAds' variable in storage
        chrome.storage.local.get(['skippedAds'], (result) => {
            //console.log("2");
            let stored_value = parseInt(result['skippedAds']) + 1;
            //console.log("3");
            console.log("SkippedAds: ", stored_value)
            if (isNaN(stored_value) == true) { stored_value = 0; }
            chrome.storage.local.set({skippedAds: stored_value}, () => { console.log('Skipped Ad', stored_value); });
        });
        //console.log("updated value");
        
    }
    catch(err)
    {
        // Do Nothing
    }
    
    
    
    
    // If there is a not skippadble Ad, replace it with a GIF
    try {
        document.getElementsByClassName('ytp-ad-text ytp-ad-preview-text')[0].innerHTML = "Sorry, I can't skip this one 🥲🥲";
        document.getElementsByClassName('video-stream html5-main-video')[0].style.cssText += "opacity:5%;";
        
        // If it came to this without falling failing, there is a non-skippable Ad
        
        // Inject Background image
        if (isGifInserted == false)
        {
            console.log("Added background");
            
            isGifInserted = true;
            
            youtubeVideoContainer = document.getElementsByClassName('html5-video-container')[0];
            
            gifElement = document.createElement("div");
            gifElement.innerHTML = `<img id="${GIF_OVERLAY_ID}" src="${GIFs[Math.floor(Math.random() * GIFs.length)]}" style="position: relative; width: 100%; height: 100%;">`;
            youtubeVideoContainer.appendChild(gifElement);
            
            // Increment 'replacedAds' variable in storage
            chrome.storage.local.get(['replacedAds'], (result) => {
                console.log("Got local value", result);
                let stored_value = parseInt(result['replacedAds']) + 1;
                console.log("x", stored_value);
                if (isNaN(stored_value) == true) { stored_value = 0; }
                console.log("y", stored_value);
                chrome.storage.local.set({replacedAds: stored_value}, () => { console.log('Add replaced', stored_value); });
            });
        }
    
        mutePage(true);
        
    }
    catch(err) {
        // No Ad, remove the GIF and up the opacity
        document.getElementsByClassName('video-stream html5-main-video')[0].style.cssText += "opacity:100%;";
        
        if (isGifInserted == true)
        {
            youtubeVideoContainer = document.getElementsByClassName('html5-video-container')[0];
            // youtubeVideoContainer.removeChild();
            document.getElementById(GIF_OVERLAY_ID).remove();
            isGifInserted = false;
            mutePage(false);
        }
    }
    
    // Try to remove Ads below the main player
    try {
        document.getElementsByClassName('ytd-merch-shelf-renderer')[0].innerHTML = "Reklama go wroooo";
        document.getElementById('player-ads').innerHTML = "Reklama go wroooo";
    }
    catch(err)
    {
        // Do nothing
    }
});

console.log("Filip's Add skipper");

// Ovserver, this will fire when video timer changes
function startObserving() {
    // observe everything except attributes
    //observer.observe(document.querySelector('.ytp-time-current'), {
    console.log("--->",document.querySelector('.ytp-ad-module'));
    observer.observe(document.querySelector('.ytp-ad-module'), {
        childList: true, // observe direct children
        subtree: false, // and lower descendants too
        characterDataOldValue: true // pass old data to callback
    });

}


// Attempt to inject script after loading, no success :(
startObserving();
document.addEventListener('load', startObserving);

