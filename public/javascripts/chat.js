let chatUserName = 'Guest_' + Math.floor(Math.random() * 10000);
let roomName = 'global';
const chatSocket = io();
let chat_messages = {}

// This creates the localStorage variable for the chat, if it doesn't exist yet!
if (!localStorage.getItem('isChatOpened'))
    localStorage.setItem('isChatOpened', 'false')


/** Function called by the main *"init"* functions to properly set attributes of the **chat** elements. */
function initChat() {
    makeAxiosGet('/chat.html')
        .then(res => {
            const begin = res.data.indexOf('<body')
            const end = res.data.indexOf('</body>') + 7
            document.getElementById("defaultChatPosition").innerHTML =
                res.data.slice(begin, end).replaceAll('body', 'div')

            document.getElementById('chatIconBtn').onclick = clickChatBtn;
            document.getElementById('chatButtonSmall').onclick = clickNavbarBtn
            document.getElementById('closeChat').onclick = closeChat;
            document.getElementById('acceptTermsBtn').onclick = acceptedTerms;
            document.getElementById('declineTermsBtn').onclick = closeChat;
            document.getElementById("submitForm").onclick = submitChatForm;
            document.getElementById("leaveButton").onclick = leaveRoom;
            document.getElementById('sendMsgBtn').addEventListener('click', sendMessage)
            document.getElementById('textField').addEventListener('submit', sendMessage)
            if (localStorage.getItem('acceptedChatTerms')) {
                closeChatTerms();
                if (localStorage.getItem('connectedRoom')) {
                    if (localStorage.getItem('connectedRoom') !== 'false') {
                        const room = !localStorage.getItem('connectedRoom') ? roomName : localStorage.getItem('connectedRoom')
                        const name = !localStorage.getItem('chatUserName') ? chatUserName : localStorage.getItem('chatUserName')
                        connectToRoom(room, name, false)
                    }
                }
            }
            initChatSocket()
            if (localStorage.getItem('isChatOpened') === 'true')
                openChat()
        })
        .catch(err => console.error('unable to retrieve chat page\n', err));
}

/** Function used to set the initial chat divs and buttons at every page-load.
 * Called by the init function. */
function toggleChatElements() {
    if (localStorage.getItem('isChatOpened') !== 'true')
        openChat()
    else
        closeChat()
}

/**Hide a html element by adding the d-none class
 * @param node The html element to hide*/
function hideNode(node) {
    if (node instanceof HTMLElement) {
        node.classList.add('d-none')
    } else
        console.error("wrong element:", node, "is not a HTMLElement")
}

/**Show a html element by removing the d-none class
 * @param node The html element to show*/
function showNode(node) {
    if (node instanceof HTMLElement)
        node.classList.remove('d-none');
    else
        console.error("wrong element:", node, "is not a HTMLElement")
}

/**
 *It hides the hideForChat element and chatButton on bottom-right side of the screen, and shows the chatDiv element
 *
 * @param hideBigAdv If it is false the function will show chat without hiding the adv
 * @param hideChatAdv If it is true the function will not show the adv on top of the chatDiv
 **/
function openChat(hideBigAdv = true, hideChatAdv = false) {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const btnDiv = document.getElementById('btnDiv');
    localStorage.setItem('isChatOpened', 'true');
    if (hideBigAdv) {
        hideNode(hideForChat)
        hideNode(btnDiv)
    }

    if (!chatDiv.classList.contains('d-lg-flex')) {
        chatDiv.classList.add('d-lg-flex')
    }
    showNode(chatDiv)
    if (hideChatAdv) {
        hideNode(document.getElementById('chatAdv'))
    } else {
        showNode(document.getElementById('chatAdv'))
    }
}

/**It hides the chatDiv showing the big adv.
 *
 * @param hideChat If it is false the function will not hide the chat*/
function closeChat(hideChat = true) {
    const hideForChat = document.getElementById('hideForChat');
    const chatDiv = document.getElementById('chatDiv');
    const btnDiv = document.getElementById('btnDiv');

    showNode(hideForChat)
    showNode(btnDiv)

    if (hideChat) {
        if (chatDiv.classList.contains('d-lg-flex')) {
            localStorage.setItem('isChatOpened', 'false');
            chatDiv.classList.remove('d-lg-flex')
        }
        hideNode(chatDiv)
    }
}

/** Function called whenever the chat button is clicked.
 *
 * It checks the window size and move the chatDiv in the right position*/
function clickChatBtn() {
    if (window.innerWidth >= 992) { //set chat on side
        let chatHeader = document.getElementById('chatHeader')
        if (chatHeader.parentElement.id !== 'chatLandingElement') {  //chat was inside offcanvas, needs to be moved on the side
            let chatBody = document.getElementById('chatBody')
            let chatTerms = document.getElementById('chatTerms')
            let chatLandingElements = document.getElementById("chatLandingElems") //where to append chatHeader and chatBody
            let chatDiv = document.getElementById('chatDiv') //where to append terms
            let closeChatBtn = document.getElementById('closeChat')

            chatLandingElements.appendChild(chatHeader)
            chatLandingElements.appendChild(chatBody)
            chatDiv.appendChild(chatTerms)
            closeChatBtn.removeAttribute('data-bs-dismiss')
            closeChat()
        }
    }
    toggleChatElements();
    if (!localStorage.getItem('acceptedChatTerms'))  // Add here "|| true" to make terms to display every time.
        showChatTerms();
}

/**Function called whenever the chat button in the navbar is clicked.

 It checks the window size and move the chatDiv in the right position*/
function clickNavbarBtn(attr) {
    if (window.innerWidth < 992) { //set chat in offcanvas
        let chatHeader = document.getElementById('chatHeader')
        if (chatHeader.parentElement.id !== 'chatOffCanvas') {
            closeChat()
            let chatBody = document.getElementById('chatBody')
            let chatTerms = document.getElementById('chatTerms')
            let chatOffCanvas = document.getElementById('chatOffCanvas') //where to append chatHeader and chatBody and Terms
            let closeChatBtn = document.getElementById('closeChat')

            chatOffCanvas.appendChild(chatHeader)
            chatOffCanvas.appendChild(chatBody)
            chatOffCanvas.appendChild(chatTerms)

            closeChatBtn.setAttribute('data-bs-dismiss', 'offcanvas')
            showNode(chatHeader)
            showNode(chatBody)
        }
    }
    if (!localStorage.getItem('acceptedChatTerms'))  // Add here "|| true" to make terms to display every time.
        showChatTerms();
}

/** Function called to show the chat **terms** in the chat div. */
function showChatTerms() {
    let chatTerms = document.getElementById('chatTerms');
    if (chatTerms.classList.contains('d-none'))
        chatTerms.classList.remove('d-none');
    setTermsHeight(chatTerms);
}

/** Function used to set the **height** of the terms-div dynamically.
 * @param chatTerms {HTMLElement} It is the DOM element of the chat terms. */
function setTermsHeight(chatTerms) {
    let loginRect = document.getElementById('submitForm').getBoundingClientRect();
    chatTerms.style.minHeight = '100px';
    chatTerms.style.height = String((visualViewport.height - loginRect.bottom - 10)) + 'px';
    chatTerms.style.maxHeight = String((visualViewport.height - loginRect.bottom - 10)) + 'px'; //@todo: why this?
}

/** Function called when the terms are accepted.
 * @note It must show the terms only once*/
function acceptedTerms() {
    if (!localStorage.getItem('acceptedChatTerms'))
        localStorage.setItem('acceptedChatTerms', 'true');
    closeChatTerms();
}

/** This function only assures to close the chat terms. */
function closeChatTerms() {
    let chatTerms = document.getElementById('chatTerms');
    if (!chatTerms.classList.contains('d-none'))
        document.getElementById('chatTerms').classList.add('d-none');
}

/* --------------- SOCKET --------------- */

/** Initializing the chat socket. */
function initChatSocket() {
    chatSocket.on('joined', function (room, userId) {
        if (userId === chatUserName) {
            hideLoginInterface()
            writeOnChat('mainServer', 'You entered in room "' + room + '"')
            let chatHeader = document.getElementById("chatHeader")
            chatHeader.classList.add('bg-light', 'border_bottom')

            let chatName = document.getElementById('chatName')
            chatName.innerHTML = roomName
            chatName.classList.remove('d-none')

            let chatLoginHeader = document.getElementById("chatLoginHeader")
            chatLoginHeader.classList.add('d-none')

            let leaveBtnDiv = document.getElementById('leaveBtnDiv')
            leaveBtnDiv.classList.remove('d-none')

            document.getElementById('textInput').focus()
        }
    })

    /** It receives a list of all rooms opened with the server and add them to the list of rooms in the chat form*/
    chatSocket.on("rooms list", (list) => {
        let roomsList = document.getElementById("roomsList")
        let node
        for (let room of list) {
            node = document.createElement('option')
            node.value = room
            roomsList.appendChild(node)
        }
    })

    chatSocket.on('chat', function (userId, chatText) {
        if (userId !== null)
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
 *  calls connectToRoom, which connects to socket
 *
 *  @param event The click event on submitFormButton
 */
function submitChatForm(event) {//connect button function
    let formData = extractFormData("chatLoginForm", false);
    const room = !formData.customRoom ? roomName : formData.customRoom
    const name = !formData.customName ? chatUserName : formData.customName
    connectToRoom(room, name, formData.makePublic)

    event.preventDefault();
}

/**
 * Connects to socket
 * @param room Which room to connect
 * @param userName which name will be used chatting
 * @param makePublic if the room will be visible to everyone or not
 */
function connectToRoom(room, userName, makePublic) {
    document.getElementById('submitForm').disabled = true
    chatUserName = userName
    roomName = room
    localStorage.setItem('connectedRoom', room)
    localStorage.setItem('chatUserName', userName)
    chatSocket.emit('create or join', roomName, chatUserName, makePublic)
}

/**
 * Called when 'click' event occurs on leaveButton
 *  hide login section, and sets chat section
 *
 *   @param event The click event on leaveButton
 */
function leaveRoom(event) {
    chatSocket.emit('leave conversation', roomName, chatUserName)
    document.getElementById('loginForm').classList.remove('d-none')
    document.getElementById('chat').classList.add('d-none')
    document.getElementById('chatName').classList.add('d-none')
    document.getElementById('chatLoginHeader').classList.remove('d-none')
    document.getElementById('leaveBtnDiv').classList.add('d-none')

    let chatHeader = document.getElementById("chatHeader")
    chatHeader.classList.remove('bg-light', 'border_bottom')
    document.getElementById('messages').replaceChildren() //replace children with null
    document.getElementById('submitForm').disabled = false
    localStorage.setItem('connectedRoom', 'false')

    event.preventDefault();
}

/** Called when 'click' event occurs on sendMsgBtn
 * extract and clears form's input
 * check if it's void
 * write on chat and emit msg to the socket
 *
 *  @param event The click event on the sendMsgBtn
 * */
function sendMessage(event) {
    let text = String(extractFormData('textField', false).textInput).trim();
    document.getElementById('textInput').value = '';
    if (!text || text.length < 1) {
        console.error("Error on text string");
        event.preventDefault();
        return; // @todo end this case (what to do ?)
    }
    chatSocket.emit("chat", roomName, chatUserName, text);
    event.preventDefault();
}


/** It appends the given html text to messages div
 * @param userId {string} who sent the message
 * @param text {string} message content
 * */
function writeOnChat(userId, text) {
    // handle userId == null case
    if (text && String(text).trim().length !== 0) {
        let msgNode = document.createElement('div')
        msgNode.classList.add('my-1', 'mx-5', 'p-2')
        if (userId === 'mainServer') {
            msgNode.classList.add('ps-3', 'pe-3', 'text-center')
            msgNode.innerHTML = '<i>' + text + '</i>'
        } else {
            msgNode.classList.add('rounded-4')
            const sender = userId === chatUserName ? "You" : userId
            if (sender === "You")
                msgNode.classList.add('me-2', 'border', 'self-message', 'text-end')
            else
                msgNode.classList.add('ms-2', 'border', 'other-message', 'text-start')
            msgNode.innerHTML = '<b>' + sender + '</b><br><p class="text-start"></p>'
            msgNode.lastElementChild.innerText = text
        }

        let msgContainer = document.getElementById('messages');
        if (msgContainer.childElementCount >= 20)
            msgContainer.removeChild(msgContainer.lastChild);
        msgContainer.insertBefore(msgNode, msgContainer.firstChild);
    } else
        console.error('Text to send is null.')
}

/** It hides the initial form and shows the chat.*/
function hideLoginInterface() {
    document.getElementById('loginForm').classList.add('d-none')
    document.getElementById('chat').classList.remove('d-none')
}
