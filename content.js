browser.runtime.onMessage.addListener((message) => {
    if (message.type === "showPopup") {
        const { word, data } = message;
        console.log(`Message received: ${JSON.stringify(message)}`);
        clearSelection(); // Clear selection before showing the popup
        showPopup(word, data);
    }
});

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

function showPopup(word, data) {
    console.log(`Showing popup for word: ${word}`);

    // Disable text selection on the rest of the page
    document.body.style.userSelect = 'none';

    // Remove any existing popup to avoid duplicates
    const existingPopup = document.querySelector(".dictionary-popup");
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create the popup element
    const popup = document.createElement("div");
    popup.className = "dictionary-popup";

    const wordElem = document.createElement("h3");
    wordElem.textContent = word;
    popup.appendChild(wordElem);

    data[0].meanings.forEach(meaning => {
        const partOfSpeech = document.createElement("h4");
        partOfSpeech.textContent = meaning.partOfSpeech;
        popup.appendChild(partOfSpeech);

        meaning.definitions.forEach(definition => {
            const defElem = document.createElement("p");
            defElem.textContent = definition.definition;
            popup.appendChild(defElem);

            if (definition.example) {
                const exampleElem = document.createElement("p");
                exampleElem.className = "example";
                exampleElem.textContent = `Example: ${definition.example}`;
                popup.appendChild(exampleElem);
            }
        });
    });

    document.body.appendChild(popup);
    console.log("Popup appended to the document");

    // Listen for click events on the document body
    const closePopupOnClickOutside = (event) => {
        if (!popup.contains(event.target)) {
            // Re-enable text selection on the rest of the page
            document.body.style.userSelect = '';
            // Remove the popup
            popup.remove();
            console.log("Popup removed");
            // Remove the click event listener
            document.removeEventListener('click', closePopupOnClickOutside);
        }
    };

    // Add click event listener to close the popup if clicked outside
    document.addEventListener('click', closePopupOnClickOutside);
}

