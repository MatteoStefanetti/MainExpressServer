let chatUserName = null;
let roomNo = null;
let roomName = null;
// This creates the localStorage variable for the chat, if it doesn't exist yet!
if(!localStorage.getItem('isChatOpened'))
    localStorage.setItem('isChatOpened', 'false');
const chatSocket = io();

function initHome() {
    // @todo initialize the GUI
    // Calling homepage routes
    addBtnFunctions();
    toggleChatElements();
    initChatSocket();
}

/** This function assigns all the 'onclick' attributes in the page. */
function addBtnFunctions() {
    document.getElementById('chatIconBtn').onclick = clickChatBtn;
    document.getElementById('closeChat').onclick = closeChat;
    document.getElementById('acceptTermsBtn').onclick = acceptedTerms;
    document.getElementById('declineTermsBtn').onclick = closeChat;
}

/** Function used to set the initial chat divs and buttons at every page-load.
 * Called by the init function. */
function toggleChatElements() {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const chatIconBtn = document.getElementById('chatIconBtn');
    console.log('chat: ', localStorage.getItem('isChatOpened') === 'true', ' elem: ' , localStorage.getItem('isChatOpened'))
    if(localStorage.getItem('isChatOpened') !== 'true'){
        document.getElementById('chatIconBtn').style.display = 'block';
        hideForChat.classList.add('d-lg-flex');
        if(chatDiv.classList.contains('d-lg-flex'))
            chatDiv.classList.remove('d-lg-flex');
    } else {
        chatIconBtn.style.display = 'none';
        hideForChat.classList.remove('d-lg-flex');
        chatDiv.classList.add('d-lg-flex');
    }
}

/** Function called whenever the chat button is clicked. */
function clickChatBtn () {
    localStorage.setItem('isChatOpened', 'true');
    if(!localStorage.getItem('acceptedChatTerms') || true)
        showChatTerms();
    toggleChatElements();
}

function showChatTerms() {
    if(document.getElementById('chatTerms').classList.contains('d-none'))
        document.getElementById('chatTerms').classList.remove('d-none');
}

function acceptedTerms(){
    if(!localStorage.getItem('acceptedChatTerms'))
        localStorage.setItem('acceptedChatTerms', 'true');
    document.getElementById('chatTerms').classList.add('d-none');
}

function closeChat() {
    localStorage.setItem('isChatOpened', 'false');
    toggleChatElements();
}

/* --------------- SOCKET --------------- */

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom(str) {
    if(str){
        roomName = str.toLowerCase()
        roomNo = hashCode(roomName);
        // Add the room to the room list
        // Set the title of the current chat as "str"
    }
}

/** HashCode function for strings.
 * @param {string} str the string to hash
 * @return {number} a hash code value for the given string, -1 if str is null */
function hashCode(str) {
    if(str){
        let h = 0, l = str.length, i = 0;
        if ( l > 0 )
            while (i < l)
                h = (h << 5) - h + str.charCodeAt(i++) | 0;
        return h;
    }
    return -1
}

/** Initializing the chat socket. */
function initChatSocket() {
    chatSocket.on('joined', function (room, userId) {
        if (userId === chatUserName) {
            hideLoginInterface(room, userId)
        } else {
            // write on chat that userId has entered
        }
    })

    chatSocket.on('chat', function (room, userId, chatText) {
        let who = userId === chatUserName ? 'You' : userId;
        writeOnChat(room, who, chatText)
    })

    chatSocket.on('disconnect', function(room, userId){
        /** Perhaps it could be launched by the {@link logOutFromChat} function as "socket.disconnect('/chat')" */
        // @todo write on chat the exit message!
    })
}

/** Called when the "send" btn is pressed. It sends the message via socket */
function sendChatText() {
    let chatText //  = get the text from document
    chatSocket.emit('chat', roomNo, chatUserName, chatText);
}

/** It connects the user to the chosen room. */
function connectToRoom() {
    // @todo Get the room from document
    if (!chatUserName) chatUserName = 'User_' + Math.random()
    chatSocket.emit('create or join', roomNo, chatUserName)
}

/** It appends the given html text to the chat div
 * @params {string} text the text to append */
function writeOnChat(room, userId, text) {
    if(text && String(text).trim().length !== 0){
        // @todo:
        // - the chat box, the paragraph where the message will be written,
        // - the default elements of a chat message (joined & disconnected, message from someone)
        // - Will use chatBox.appendChild of the message to display it properly
        // - Reset the paragraph editable text.
    } else
        console.log('Text to send is null.')
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
