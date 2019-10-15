export const socketEvents = (socket) => {
    socket.on("connect", (data) => {
        console.log(data);
    });

    socket.on('create game', (data) => {
       console.log("HELLO");
    });
};