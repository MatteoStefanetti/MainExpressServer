let chatUserName = null;
let roomNo = null;
let roomName = null;
// This creates the localStorage variable for the chat, if it doesn't exist yet!
if(!localStorage.getItem('isChatOpened'))
    localStorage.setItem('isChatOpened', 'false');
const chatSocket = io();

/** Called by the index.html page. */
function initHome() {
    // @todo initialize the GUI
    // Calling homepage routes
    commonInitOfPage();
}

/** Called by the clubs.html page. */
function initClubs() {
    commonInitOfPage();
}

/* -------- End of init()s -------- */

/** Function called by the **main** *"init"* functions to set common attributes and features. */
function commonInitOfPage() {
    addBtnFunctions();
    initChat();
}

/** This function assigns **ALL** the *'onclick'* attributes in the page. */
function addBtnFunctions() {
    document.getElementById('chatIconBtn').onclick = clickChatBtn;
    document.getElementById('closeChat').onclick = closeChat;
    document.getElementById('acceptTermsBtn').onclick = acceptedTerms;
    document.getElementById('declineTermsBtn').onclick = closeChat;
}
