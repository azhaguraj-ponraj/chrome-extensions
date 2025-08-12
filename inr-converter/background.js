chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "usdToInr",
        title: "Convert USD to INR",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "usdToInr") {
        const usdValue = parseFloat(info.selectionText.replace(/[^0-9.]/g, ""));
        if (isNaN(usdValue)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (msg) => alert(msg),
            args: ["Invalid USD amount selected."]
        });
        return;
        }
        convertUSDtoINR(usdValue);
    }
});

function convertUSDtoINR(amount) {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/USD`; // Example API URL, replace with actual API

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates.INR;
            const convertedAmount = (amount * rate).toFixed(2);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: (msg) => alert(msg),
                    args: [`Converted Amount: ₹${convertedAmount}`]
                });
            });
        })
        .catch(error => {
            console.error('Error fetching exchange rate:', error);
            alert('Failed to convert currency. Please try again later.');
        });
}
