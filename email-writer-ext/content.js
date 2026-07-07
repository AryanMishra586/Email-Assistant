console.log("Email Writer Assistant Extension - Content Script Loaded");

function findComposeToolbar() {


    const selectors = [
        '.aDh', // Gmail compose toolbar
        '.btC', // Gmail reply toolbar
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for(const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if(toolbar) {
            return toolbar;
        }
    }

    return null;
}

function createAIButton() {

    const button = document.createElement('div');
    button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
    button.style.marginRight = "8px";
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function injectButton(){

    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) {
        existingButton.remove();
    }

    const toolbar = findComposeToolbar();

    if(!toolbar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found.")
    const button = createAIButton();

    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        console.log("AI Reply Button Clicked");

    });

    toolbar.insertBefore(button, toolbar.firstChild);
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