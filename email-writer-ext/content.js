console.log("Email Writer Assistant Extension - Content Script Loaded");


function injectButton(){

}
const observer = new MutationObserver((mutations) => {

    for(const mutation of mutations) {
        const addedNodes= Array.from(mutation.addedNodes);
        const hasComposedElements = addedNodes.some(node => node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role = "dialog"]') || node.querySelector('.aDh, .btC, [role = "dialog"]'))
        );

        if(hasComposedElements) {
            console.log("Composed email elements detected. Injecting the button...");
            setTimeout(injectButton, 500);
        }

    }

});

observer.observe(document.body, { childList: true, subtree: true });