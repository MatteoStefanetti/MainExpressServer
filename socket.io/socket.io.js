module.exports = function(io) {
    const chat = io
        .on('connection', function (socket) {
            try {
                /** It creates or joins a room
                 * @param room The effective chat in which the messages will be sent.
                 * @param userId It will be the user who joined the room */
                socket.on('create or join', function (room, userId) {
                    socket.join(room);
                    chat.to(room).emit('joined', room, userId);
                });

                /** It uses the chat function
                 * @param room The effective chat in which the messages will be sent.
                 * @param userId It will be the user who joined the room.
                 * @param chatText It will be the chat message to send in the room. */
                socket.on('chat', function (room, userId, chatText) {
                    chat.to(room).emit('chat', room, userId, chatText);
                });

                /** It disconnects userId from a room.
                 * @param room The effective chat in which the messages will be sent.
                 * @param userId It will be the user who left the room. */
                socket.on('disconnect', function (room, userId) {
                    console.log('someone disconnected');
                    chat.to(room).emit('chat', room, userId, 'disconnected')
                });
            } catch (err) {
                console.log(err)
            }
        });
};
