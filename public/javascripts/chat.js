let chatUserName = 'Guest_' + Math.floor(Math.random()*10000);
let roomName = 'global';
const chatSocket = io();
let chat_messages = {}

// This creates the localStorage variable for the chat, if it doesn't exist yet!
if(!localStorage.getItem('isChatOpened'))
    localStorage.setItem('isChatOpened', 'false');

/** Function called by the main *"init"* functions to properly set attributes of the **chat** elements. */
function initChat() {
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
    if(localStorage.getItem('isChatOpened') === 'true')
        openChat()
}

/** Function used to set the initial chat divs and buttons at every page-load.
 * Called by the init function. */
function toggleChatElements() {
    if(localStorage.getItem('isChatOpened') !== 'true')
        openChat()
    else
        closeChat()
}

function hideNode( node ) {
    if(node instanceof HTMLElement)
        node.classList.add('d-none');
    else
        console.error("wrong element:", node, "is not a HTMLElement")
}

function showNode( node ) {
    if(node instanceof HTMLElement)
        node.classList.remove('d-none');
    else
        console.error("wrong element:", node, "is not a HTMLElement")
}

function openChat() {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const btnDiv = document.getElementById('btnDiv');
    localStorage.setItem('isChatOpened', 'true');
    hideNode(hideForChat)
    hideNode(btnDiv)
    showNode(chatDiv)
}

function closeChat() {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const btnDiv = document.getElementById('btnDiv');
    localStorage.setItem('isChatOpened', 'false');
    showNode(hideForChat)
    showNode(btnDiv)
    hideNode(chatDiv)
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

/* --------------- SOCKET --------------- */

/** Initializing the chat socket. */
function initChatSocket() {
    chatSocket.on('joined', function (room, userId) {
        if (userId === chatUserName) {
            hideLoginInterface(room, userId)
            writeOnChat('mainServer', 'You entered in room "' + room + '"' )
            let chatHeader = document.getElementById("chatHeader")
            chatHeader.classList.add('bg-light','border_bottom')

            let chatName = document.getElementById('chatName')
            chatName.innerHTML =roomName
            chatName.classList.remove('d-none')

            let chatLoginHeader = document.getElementById("chatLoginHeader")
            chatLoginHeader.classList.add('d-none')

            let leaveBtnDiv = document.getElementById('leaveBtnDiv')
            leaveBtnDiv.classList.remove('d-none')

            document.getElementById('textInput').focus()
        }
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

    chatSocket.on('chat', function (userId, chatText) {
        if(userId !== null && userId !== chatUserName)
            writeOnChat(userId, chatText)
    })

    chatSocket.on('disconnect', () => {
        //chatSocket.emit('leave conversation', roomName, chatUserName);
        /** Perhaps it could be launched by the {@link leaveRoom} function as "socket.disconnect('/chat')" */
        // @todo write on chat the exit message!
    })

}

/**
 * Called when 'click' event occurs on login submitForm
 *  extract and stores form's data
 *  send it to the socket
 */
function connectToRoom(event) {//connect button function
    document.getElementById('submitForm').disabled = true

    let formData = extractFormData("chatLoginForm");
    chatUserName = !formData.customName ? chatUserName : formData.customName
    roomName = !formData.customRoom ? roomName : formData.customRoom
    chatSocket.emit('create or join', roomName, chatUserName, formData.makePublic)

    event.preventDefault();
}

/**
 * Called when 'click' event occurs on leaveButton
 *  hide login section, and sets chat section
 */
function leaveRoom(event) {
    chatSocket.emit('leave conversation', roomName, chatUserName)
    document.getElementById('loginForm').classList.remove('d-none')
    document.getElementById('chat').classList.add('d-none')
    document.getElementById('chatName').classList.add('d-none')
    document.getElementById('chatLoginHeader').classList.remove('d-none')
    document.getElementById('leaveBtnDiv').classList.add('d-none')

    let chatHeader = document.getElementById("chatHeader")
    chatHeader.classList.remove('bg-light','border_bottom')
    document.getElementById('messages').replaceChildren() //replace children with null
    document.getElementById('submitForm').disabled = false

    event.preventDefault();
}

/** Called when 'click' event occurs on sendMsgBtn
 * extract and clears form's input
 * check if it's void
 * write on chat and emit msg to the socket
 * */
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
    event.preventDefault();
}


/** It appends the given html text to the chat div
 * @param userId who sent the message
 * @param text message content
 * */
function writeOnChat(userId, text) {
    // handle userId == null case
    if(text && String(text).trim().length !== 0){
        let msgNode = document.createElement('div')
        msgNode.classList.add('border-bottom', 'py-2')
        if(userId === 'mainServer') {
            msgNode.classList.add('ps-3', 'pe-3', 'text-center')
            msgNode.innerHTML = '<i>'+ text + '</i>'
        } else {
            const sender = userId===chatUserName ? "You" : userId
            if(sender === "You")
                msgNode.classList.add('ps-3', 'pe-1', 'text-end')
            else
                msgNode.classList.add('ps-1', 'pe-3', 'text-start')

            msgNode.innerHTML = '<b>' + sender + '</b>' + '<br>' + text
        }

        let msgContainer = document.getElementById('messages');
        if(msgContainer.childElementCount >= 20)
            msgContainer.removeChild(msgContainer.lastChild);
        msgContainer.insertBefore(msgNode, msgContainer.firstChild);
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
