let chatUserName = 'Guest_' + Math.floor(Math.random()*10000);
let roomName = 'global';
const chatSocket = io();

// This creates the localStorage variable for the chat, if it doesn't exist yet!
if(!localStorage.getItem('isChatOpened'))
    localStorage.setItem('isChatOpened', 'false');

/** Function called by the main *"init"* functions to properly set attributes of the **chat** elements. */
function initChat() {
    toggleChatElements();
    initChatSocket();
}

/** Function used to set the initial chat divs and buttons at every page-load.
 * Called by the init function. */
function toggleChatElements() {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const chatIconBtn = document.getElementById('chatIconBtn');
    if(localStorage.getItem('isChatOpened') !== 'true'){
        document.getElementById('chatIconBtn').style.display = 'block';
        hideForChat.classList.add('d-lg-flex');
        if(chatDiv.classList.contains('d-lg-flex'))
            chatDiv.classList.remove('d-lg-flex');
    } else {
        chatIconBtn.style.display = 'none';
        hideForChat.classList.remove('d-lg-flex');
        chatDiv.classList.add('d-lg-flex');
        if(localStorage.getItem('acceptedChatTerms'))
            closeChatTerms();
    }
}

/** Function called whenever the chat button is clicked. */
function clickChatBtn () {
    localStorage.setItem('isChatOpened', 'true');
    toggleChatElements();
    if(!localStorage.getItem('acceptedChatTerms'))  // Add here "|| true" to make terms to display every time.
        showChatTerms();
}

/** Function called to show the chat **terms** in the chat div. */
function showChatTerms() {
    let chatTerms = document.getElementById('chatTerms');
    if(chatTerms.classList.contains('d-none'))
        chatTerms.classList.remove('d-none');
    setTermsHeight(chatTerms);
}

/** Function used to set the **height** of the terms-div dynamically.
 * @param chatTerms {HTMLElement} It is the DOM element of the chat terms. */
function setTermsHeight(chatTerms){
    let loginRect = document.getElementById('submitForm').getBoundingClientRect();
    chatTerms.style.minHeight = '100px';
    chatTerms.style.height = String((visualViewport.height - loginRect.bottom - 10)) + 'px';
    chatTerms.style.maxHeight = String((visualViewport.height - loginRect.bottom - 10)) + 'px';
}

/** Function called when the terms are accepted.
 * @note It must show the terms only one per device. */
function acceptedTerms(){
    if(!localStorage.getItem('acceptedChatTerms'))
        localStorage.setItem('acceptedChatTerms', 'true');
    closeChatTerms();
}

/** This function only assures to close the chat terms. */
function closeChatTerms() {
    document.getElementById('chatTerms').classList.add('d-none');
}

/** This function closes the chat and updates the localStorage variable. */
function closeChat() {
    localStorage.setItem('isChatOpened', 'false');
    toggleChatElements();
}

/* --------------- SOCKET --------------- */
// @todo: check all functions below

/** Initializing the chat socket. */
function initChatSocket() {
    chatSocket.on('joined', function (room, userId) {
        if (userId === chatUserName) {
            hideLoginInterface(room, userId)
        } else {
            // write on chat that userId has entered
        }
        let chatHeader = document.getElementById("chatHeader")
        chatHeader.classList.add('bg-light','border_bottom')
        let chatHeaderText = document.getElementById('chatHeaderText')
        chatHeaderText.classList.add('h2','h-75')
        chatHeaderText.innerText = roomName
    })

    /** It receives a list of all rooms opened with the server and add them to the list of rooms in the chat form*/
    chatSocket.on("rooms list", (list)=>{
        let roomsList = document.getElementById("roomsList")
        let node
        for( let room of list){
            node = document.createElement('option')
            node.value = room
            roomsList.appendChild(node)
        }
    })

    chatSocket.on('chat', function (room, userId, chatText) {
        writeOnChat(room, userId, chatText)
    })

    chatSocket.on('leave conversation', (room, userID) => {
        writeOnChat(room, userID, "leaved the conversation")
    })

    chatSocket.on('disconnect', function(room, userId){
        /** Perhaps it could be launched by the {@link logOutFromChat} function as "socket.disconnect('/chat')" */
        // @todo write on chat the exit message!
    })

}

/** Called when the "send" btn is pressed. It sends the message via socket */
function sendChatText() { // @todo
    let chatText //  = get the text from document
    chatSocket.emit('chat', roomName, chatUserName, chatText);
}

function connectToRoom(event) {//connect button function
    document.getElementById('submitForm').disabled = true
    // @todo: able log out button
    let formData = extractFormData("chatLoginForm");
    chatUserName = !formData.customName ? chatUserName : formData.customName
    roomName = !formData.customRoom ? roomName : formData.customRoom
    chatSocket.emit('create or join', roomName, chatUserName)

    event.preventDefault();
}



/** It appends the given html text to the chat div
 * @param userId who sent the message
 * @param text message content
 * */
function writeOnChat(userId, text) {
    // handle userId == null case
    if(text && String(text).trim().length !== 0){
        const sender = userId===chatUserName ? "You" : userId
        // @todo:
        // - the chat box, the paragraph where the message will be written,
        // - the default elements of a chat message (joined & disconnected, message from someone)
        // - Will use chatBox.appendChild of the message to display it properly
        // - Reset the paragraph editable text.
    } else
        console.error('Text to send is null.')
}

/** It hides the initial form and shows the chat.
 * @param room the selected room
 * @param userId the userName */
function hideLoginInterface(room, userId) {
    // @todo set the GUI properties
}

/** It hides the chat and shows the initial form.
 * @param room the current room
 * @param userId the userName */
function logOutFromChat(room, userId){
    chatSocket.emit('disconnect', room, userId)
    // todo
}
