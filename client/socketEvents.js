export const socketEvents = (socket) => {
    socket.on("create game", (data) => {
        console.log("DATA", data);
    });
};