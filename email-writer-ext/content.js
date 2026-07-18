import getApiUrl from "./config.js";

const API_URL = await getApiUrl();


console.log("Email Writer Assistant Extension - Content Script Loaded");

function getEmailContent() {

    const selectors = [
        '.h7', 
        '.a3s.aiL', 
        '.gmail_quote', // Gmail quoted text
        '[role="presentation"]'
    ];

    for(const selector of selectors) {
        const content = document.querySelector(selector);
        if(content) {
            return content.innerText.trim();
        }
    }

    return '';
}


// function findComposeToolbar() {


//     const selectors = [
//         '.aDh', // Gmail compose toolbar
//         '.btC', // Gmail reply toolbar
//         '[role="toolbar"]',
//         '.gU.Up'
//     ];

//     for(const selector of selectors) {
//         const toolbar = document.querySelector(selector);
//         if(toolbar) {
//             return toolbar;
//         }
//     }

//     return null;
// }

function findComposeToolbar() {
    return document.querySelector(".dC");
}

function createAIButton() {

    const button = document.createElement('div');
    button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
    button.style.marginLeft = "12px";
    button.style.marginRight = "12px";
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
    console.log(toolbar.innerHTML)
    const button = createAIButton();

    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        console.log("AI Reply Button Clicked");

        try{
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();

            const response = await fetch(`${API_URL}/api/email/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailContent: emailContent,
                    tone : 'professional'
                 })
            });

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role = "textbox"][g_editable="true"]');

            if(composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
            else{
                console.error("Compose box not found");
            }
        }
        catch(error){
            console.error("Error generating AI reply:", error);
            alert("Error generating AI reply. Please check the console for details.");
        }
        finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
    // toolbar.appendChild(button);
  
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