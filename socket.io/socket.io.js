let roomsMap = new Map([ //@todo: check if this is the right place for the object declaration
    ['global', 1], // default chats start with 1 logged user (prevent deleting this chat, counting server as user)
    ['england', 1],
    ['emirates fa cup', 1]
])

module.exports = function(io) {
    /** It is a map where keys are rooms names and value are users logged in. */
    const chat = io
        .on('connection', function (socket) {

            sendRooms(socket)

            try {

                /** It creates or joins a room
                 * @param room The effective chat in which the messages will be sent.
                 * @param userId It will be the user who joined the room */
                socket.on('create or join', function (room, userId, public) {
                    socket.join(room);
                    chat.to(room).emit('joined', room, userId);
                    if(roomsMap.has(room) || public)
                        addUserToRoom(room)
                });

                /** It uses the chat function
                 * @param room The effective chat in which the messages will be sent.
                 * @param userId It will be the username who joined the room.
                 * @param chatText It will be the chat message to send in the room. */
                socket.on('chat', function (room, userId, chatText) {
                    chat.to(room).emit('chat', room, userId, chatText);
                });

                /** It disconnects userId from a room.
                 * @param room The effective chat in which the messages will be sent.
                 * @param userId It will be the username who left the room. */
                socket.on('leave conversation', (room, userId) => { //check during tests if room exists
                    io.to(room).emit('leave conversation', userId)
                    removeUserFromRoom(room)
                    socket.leave(room)
                });

                socket.on('disconnect', () => {
                    console.log('A user disconnected.');// @todo: this could fill of trash the console
                });

            } catch (err) {
                console.log(err)
            }
        });
};

/** Functions to manage roomsMap elements and their values **/

/** It finds or creates elems in roomsMap and increments the user count
 * @param roomName Name of the chat that needs to be updated.
 * */
function addUserToRoom(roomName) {
    let usersNum = roomsMap.get(roomName)
    if(!usersNum) {
        usersNum = 0
    }
    roomsMap.set(roomName, ++usersNum)
}

/** It finds elems in roomsMap and decrements the user count, removing in case
 * pre: the room "roomName" must exist
 * @param roomName Name of the chat that needs to be updated.
 * */
function removeUserFromRoom(roomName) {
    let usersNum = roomsMap.get(roomName)
    if(!roomName){
    } else if(roomName===1){
        roomsMap.delete(roomName)
    } else {
        roomsMap.set(roomName, usersNum-1)
    }
}

/** It sends all custom and default rooms keys to a socket */
function sendRooms(socket) {
    let keys = []
    for (const key of roomsMap.keys()){
        keys.push(key)
    }
    socket.emit('rooms list', keys)
}