console.log("top");

function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('https://sc-apps-new.rutgers.edu/portal/scheduling/mine/') == 0) {
	    chrome.pageAction.show(tabId);
	}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);
function getInfo(info) {
    if (info != undefined)
    {
        console.log("works better now "+info);
        document.getElementById('data').textContent = info; 
    }
}
