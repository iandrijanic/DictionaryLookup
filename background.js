browser.contextMenus.create({
    id: "lookup-word",
    title: "Look up '%s'",
    contexts: ["selection"]
});

console.log("Context menu item created");

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookup-word") {
        const word = info.selectionText;
        console.log(`Selected word: ${word}`);
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Received data: ${JSON.stringify(data)}`);
                browser.tabs.sendMessage(tab.id, {
                    type: "showPopup",
                    word: word,
                    data: data
                });
            })
            .catch(error => {
                console.error(`Error fetching data: ${error.message}`);
            });
    }
});

