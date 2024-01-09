exports.init = (io) => {
    // the socket room namespace
    const name = io
        .of('/name')
        .on('connection', function (socket) {
            try {
                /**
                 * it creates or joins a room
                 */
                socket.on('create or join', function (room, userId) {
                    socket.join(room);
                    name.to(room).emit('joined', room, userId);
                });

                socket.on('name', function (room, userId, nameText) {
                    name.to(room).emit('name', room, userId, nameText);
                });

                socket.on('disconnect', function () {
                    console.log('someone disconnected');
                });
            } catch (e) {
            }
        });
}
