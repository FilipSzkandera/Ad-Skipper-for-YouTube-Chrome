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

console.log(`${AD_SKIPPER_CONSOLE} started!`);

// Attach listener when page is updated
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    
    if (request.newpageloaded)
    {
        console.log("Called");
        await waitUntil()
        console.log("Promise resolved!");
        console.log("Disconnecting observer");
        observer.disconnect();
        console.log("Running observer again");
        startObserving();
    }
});

/**
 * Waits for AD element to load or for timeout
 */
function waitUntil(){
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            const element = document.querySelector(".ytp-ad-module");
            console.log(element);
            if (element) {
                observer.disconnect();
                return resolve();
            }
        })

        setTimeout(() => {
            observer.disconnect();
            resolve();
        }, 10000);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })
}


let isGifInserted = false;


function mutePage(state) {
    var elems = document.querySelectorAll("video, audio");
    Array.from(elems).forEach((elem) => {
        elem.muted = state;
    });
}

let observer = new MutationObserver(mutationRecords => {
    replaceAdsFunc();
});

// Observer, this will fire when video timer changes
function startObserving() {
    
    const adModuleElement = document.getElementsByClassName('ytp-ad-module');
    // const adModuleElement = document.body;
    if (adModuleElement.length !== 0) {
        console.log(adModuleElement[0])
        observer.observe(adModuleElement[0], {
            childList: true, // observe direct children
            subtree: false, // and lower descendants too
            characterDataOldValue: true // pass old data to callback
        });    
    }
}


// Attempt to inject script after loading, no success :(
// startObserving();
// document.addEventListener('load', startObserving);

function replaceAdsFunc() {
    console.log("Observer started");
    
    // Tries to click on the "Skip Ad"
    const skipButtonElement = document.getElementsByClassName('ytp-ad-skip-button-text');

    if (skipButtonElement.length !== 0) {
        console.log("Is not zero");
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

    console.log(skipButtonElement, videoElement, skipPreviewElement);

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
        document.getElementsByClassName('ytd-merch-shelf-renderer'), 
        document.getElementById('player-ads'),
        document.getElementsByTagName('ytd-ad-slot-renderer')
    ];

    additionalAdverts.forEach(elements => {
        let chosenElement;
        if (elements instanceof HTMLCollection && elements.length !== 0) {
           chosenElement = elements[0];
        }
        else if (elements instanceof HTMLElement) {
            chosenElement = elements;
        }

        if (chosenElement === undefined) return;
        console.log("Element was removed: ", chosenElement);
        chosenElement.remove();
    })
}