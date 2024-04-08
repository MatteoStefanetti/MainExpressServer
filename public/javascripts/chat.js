let chatUserName = null;
let roomName = null;

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
/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom(str) {
    if(str){
        roomName = str.toLowerCase()
        // Set the title of the current chat as "str"
    }
}

/** Initializing the chat socket. */
function initChatSocket() {
    chatSocket.on('joined', function (room, userId) {
        if (userId === chatUserName) {
            hideLoginInterface(room, userId)
        } else {
            // write on chat that userId has entered
        }
        let chatHeader = document.getElementById("chatHeader")
        chatHeader.classList.add('bg-light border_bottom')
        let chatHeaderText = document.getElementById('chatHeaderText')
        chatHeaderText.classList.add('h2 h-75')
        chatHeaderText.innerText = roomName
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

/** It connects the user to the chosen room. */
/*
function submitForm(event) {
    let formData = extractFormData();
    axios.post('/form_submission', formData)
        .then (data=>{
            data = data.data;
            document.getElementById("form_container").style.display='none';
            document.getElementById("result_container").style.display='block';
            document.getElementById('result_div').innerHTML=data;
        })
        .catch(error => {
            alert('error!!!: '+ error)
        })

    // prevent the form from reloading the page (normal behaviour for forms)
    // never forget this when you use axios!!
    event.preventDefault();
}
*/

function connectToRoom(event) {//connect button function
    // @todo Get the room from document
    let formData = extractFormData("chatLoginForm");
    chatUserName = !formData.customName ? 'Guest_' + Math.random() : formData.customName
    roomName = !formData.customRoom ? 'global' : formData.customRoom
    chatSocket.emit('create or join', roomName, chatUserName)
}

function extractFormData(formId) {
    let formElements = document.getElementById(formId).children;
    let formData={};
    for (let ix = 0; ix < formElements.length; ix++) {
        if (formElements[ix].name) {
            formData[formElements[ix].name] = formElements[ix].value;
        }
    }
    return formData;
}

/** It appends the given html text to the chat div
 * @param room where to write the message (is necessary?) @todo
 * @param userId who sent the message
 * @param text message content
 * */
function writeOnChat(room, userId, text) {
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
