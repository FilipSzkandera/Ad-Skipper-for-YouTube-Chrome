/**==============================================
 * ?                    ABOUT
 * @author      : Filip Szkandera
 * @thanksto    : Martin Procházka
 * @email       : filip.szkandera@gmail.com
 * @repo        : Ad-Skipper-for-YouTube-Chrome
 * @createdOn   : 15.10.2023
 * @description : Popup javascript handler
 *=============================================**/

const SKIPPED_ADS = 'skippedAds';
const REPLACED_ADS = 'replacedAds';

document.addEventListener("DOMContentLoaded", (event) => {
    console.log(REPLACED_ADS);
    // How many skipped ads -> show in popup
    chrome.storage.local.get([REPLACED_ADS], (result) => {
        const replacedAds = parseInt(result[REPLACED_ADS]);
        document.getElementById(REPLACED_ADS).innerHTML = replacedAds;
    });
    
    // How many skipped ads -> show in popup
    chrome.storage.local.get([SKIPPED_ADS], (result) => {
        const skippedAds = parseInt(result[SKIPPED_ADS]);
        document.getElementById(SKIPPED_ADS).innerHTML = skippedAds;
    });
});
