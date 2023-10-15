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


function mutePage(state) {
    var elems = document.querySelectorAll("video, audio");
    Array.from(elems).forEach((elem) => {
        elem.muted = state;
    });
}

let observer = new MutationObserver(mutationRecords => {
    
    // Tries to click on the "Skip Ad"
    const skipButtonElement = document.getElementsByClassName('ytp-ad-skip-button-text');

    if (skipButtonElement.length !== 0) {
        skipButtonElement[0].innerHTML = "Sorry 🥲🥲";
        skipButtonElement[0].click();

        console.log(`${AD_SKIPPER_CONSOLE}: Skipped Ad!`);
        
        // Increment 'replacedAds' variable in storage
        chrome.storage.local.get([SKIPPED_ADS], (result) => {

            let stored_value = parseInt(result[SKIPPED_ADS]) + 1;
            console.log("SkippedAds: ", stored_value)
            
            if (isNaN(stored_value) == true) {
                stored_value = 0; 
            }

            chrome.storage.local.set({skippedAds: stored_value}, () => { 
                console.log('Skipped Ad', stored_value);
            });
        });
    }
        
    
    const videoElement = document.getElementsByClassName('video-stream html5-main-video');
    const skipPreviewElement = document.getElementsByClassName('ytp-ad-text ytp-ad-preview-text');

    if (videoElement.length !== 0 && skipPreviewElement.length !== 0) {

        videoElement[0].style.cssText += "opacity:5%;";
        skipPreviewElement[0].innerHTML = "Sorry, I can't skip this one 🥲🥲";
        
        // Inject Background image
        if (isGifInserted == false)
        {
            console.log("Added background");
            
            isGifInserted = true;

            const youtubeVideoElement = document.getElementsByClassName('html5-video-container');

            if (youtubeVideoElement !== 0)
            {   
                mutePage(true);

                const gifElement = document.createElement("div");
                gifElement.innerHTML = `<img id="${GIF_OVERLAY_ID}" src="${GIFs[Math.floor(Math.random() * GIFs.length)]}" style="position: relative; width: 100%; height: 100%;">`;
                
                youtubeVideoElement[0].appendChild(gifElement);
                
                // Increment 'replacedAds' variable in storage
                chrome.storage.local.get([REPLACED_ADS], (result) => {
                    let stored_value = parseInt(result[REPLACED_ADS]) + 1;
                    
                    if (isNaN(stored_value) == true)
                    { 
                        stored_value = 0; 
                    }
                    
                    chrome.storage.local.set({replacedAds: stored_value}, () => {
                        console.log('Add replaced', stored_value);
                    });
                });
            }
        }
    }
    else if (videoElement.length !== 0) {
        // No Ad, remove the GIF and up the opacity
        videoElement[0].style.cssText += "opacity:100%;";
                
        if (isGifInserted == true)
        {
            isGifInserted = false;
            document.getElementById(GIF_OVERLAY_ID).remove();
            mutePage(false);
        }
    }


    
    // Try to remove Ads below the main player
    const additionalAdverts = [
        document.getElementsByClassName('ytd-merch-shelf-renderer')[0], 
        document.getElementById('player-ads')
    ];

    additionalAdverts.forEach(elements => {
        let chosenElement;
        if (elements instanceof HTMLCollection && elements.length !== 0) {
           chosenElement = elements[0];
        }
        else if (elements instanceof HTMLElement) {
            chosenElement = elements;
        }
        

        chosenElement.replaceChildren();
        chosenElement.innerHTML = "Reklama go wroooo";
    })

});

console.log(`${AD_SKIPPER_CONSOLE} started!`);

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

