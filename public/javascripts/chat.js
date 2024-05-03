let chatUserName = 'Guest_' + Math.floor(Math.random()*10000);
let roomName = 'global';
const chatSocket = io();
let chat_messages = {}

// This creates the localStorage variable for the chat, if it doesn't exist yet!
if(!localStorage.getItem('isChatOpened'))
    localStorage.setItem('isChatOpened', 'false');

/** Function called by the main *"init"* functions to properly set attributes of the **chat** elements. */
function initChat() {
    localStorage.setItem('isChatOpened', 'false'); //@todo: remove this line
    document.getElementById('chatIconBtn').onclick = clickChatBtn;
    document.getElementById('closeChat').onclick = closeChat;
    document.getElementById('acceptTermsBtn').onclick = acceptedTerms;
    document.getElementById('declineTermsBtn').onclick = closeChat;
    document.getElementById("submitForm").onclick =  connectToRoom;
    document.getElementById("leaveButton").onclick =  leaveRoom;
    document.getElementById('sendMsgBtn').addEventListener('click', sendMessage);
    document.getElementById('textField').addEventListener('submit', sendMessage)
    if(localStorage.getItem('acceptedChatTerms'))
        closeChatTerms();
    initChatSocket()
}

/** Function used to set the initial chat divs and buttons at every page-load.
 * Called by the init function. */
function toggleChatElements() {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const btnDiv = document.getElementById('btnDiv');
    if(localStorage.getItem('isChatOpened') !== 'true'){
        // chat opener
        localStorage.setItem('isChatOpened', 'true');
        hideNode(hideForChat)
        hideNode(btnDiv)
        showNode(chatDiv)
    } else {
        // chat closer
        localStorage.setItem('isChatOpened', 'false');
        showNode(hideForChat)
        showNode(btnDiv)
        hideNode(chatDiv)
    }
}

function hideNode( node ) {
    if(node instanceof HTMLElement)
        node.classList.add('d-none');
    else
        console.log("wrong element:", node, "is not a HTMLElement")
}

function showNode( node ) {
    if(node instanceof HTMLElement)
        node.classList.remove('d-none');
    else
        console.log("wrong element:", node, "is not a HTMLElement")
}

/** Function called whenever the chat button is clicked. */
function clickChatBtn () {
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
    chatTerms.style.maxHeight = String((visualViewport.height - loginRect.bottom - 10)) + 'px'; //@todo: why this?
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
    let chatTerms = document.getElementById('chatTerms');
    if(!chatTerms.classList.contains('d-none'))
        document.getElementById('chatTerms').classList.add('d-none');
}

/** This function closes the chat and updates the localStorage variable. */
function closeChat() {
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

        let chatName = document.getElementById('chatName')
        chatName.innerHTML =roomName
        chatName.classList.remove('d-none')

        let chatLoginHeader = document.getElementById("chatLoginHeader")
        chatLoginHeader.classList.add('d-none')

        let leaveBtnDiv = document.getElementById('leaveBtnDiv')
        leaveBtnDiv.classList.remove('d-none')
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

    let formData = extractFormData("chatLoginForm");
    console.log(formData.makePublic.checked)
    chatUserName = !formData.customName ? chatUserName : formData.customName
    roomName = !formData.customRoom ? roomName : formData.customRoom
    chatSocket.emit('create or join', roomName, chatUserName, formData.makePublic)

    event.preventDefault();
}

function leaveRoom(event) {
    //@todo check if {link @logOutFromChat} is useful
    chatSocket.emit('remove conversation', roomName, chatUserName)
    document.getElementById('loginForm').classList.remove('d-none')
    document.getElementById('chat').classList.add('d-none')
    document.getElementById('chatName').classList.add('d-none')
    document.getElementById('chatLoginHeader').classList.remove('d-none')
    document.getElementById('leaveBtnDiv').classList.add('d-none')

    let chatHeader = document.getElementById("chatHeader")
    chatHeader.classList.remove('bg-light','border_bottom')
    document.getElementById('submitForm').disabled = false

    event.preventDefault();
}

function sendMessage(event){
    let text = String(extractFormData('textField').textInput).trim();
    document.getElementById('textInput').value = '';
    if(!text || text.length < 1) {
        console.error("Error on text string");
        event.preventDefault();
        return; // @todo end this case (what to do ?)
    }
    writeOnChat(chatUserName, text);
    chatSocket.emit("chat", roomName, chatUserName, text);
    // @todo send on socket
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
        let msgNode = document.createElement('div')
        msgNode.classList.add('border-bottom', 'py-2')
        if(sender === "You")
            msgNode.classList.add('ps-3', 'pe-1', 'text-end')
        else
            msgNode.classList.add('pe-3', 'ps-1', 'text-start')

        msgNode.innerHTML = '<b>' + sender + '</b>' + '<br>' + text

        let msgContainer = document.getElementById('messages');
        msgContainer.insertBefore(msgNode, msgContainer.firstChild);
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
    document.getElementById('loginForm').classList.add('d-none')
    document.getElementById('chat').classList.remove('d-none')
}

/** It hides the chat and shows the initial form.
 * @param room the current room
 * @param userId the userName */
function logOutFromChat(room, userId){
    chatSocket.emit('disconnect', room, userId)
    document.getElementById('loginForm').classList.remove('d-none')
    document.getElementById('chat').classList.add('d-none')
    // todo
}

