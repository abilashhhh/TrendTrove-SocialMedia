"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.getReceiverSocketId = void 0;
const userSocketMap = {};
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("New connection: ", socket.id);
        const userId = socket.handshake.query.userId;
        if (userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
            if (userId !== "undefined") {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
        socket.on("typing", receiverId => {
            const receiverSocketId = (0, exports.getReceiverSocketId)(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", { senderId: userId });
            }
        });
        socket.on("stoptyping", receiverId => {
            const receiverSocketId = (0, exports.getReceiverSocketId)(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("stoptyping", { senderId: userId });
            }
        });
        socket.on("sendMessage", data => {
            const { senderId, receiverId, message } = data;
            const receiverSocketId = (0, exports.getReceiverSocketId)(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", { senderId, message });
                io.to(receiverSocketId).emit("getNotification", {
                    senderId,
                    isRead: false,
                    date: new Date(),
                    message,
                });
            }
        });
        socket.on("outgoing-voice-call", data => {
            console.log("outgoing voice call , data to: ", data === null || data === void 0 ? void 0 : data.to);
            console.log("outgoing voice call , data: ", data);
            const sendUserSocket = (0, exports.getReceiverSocketId)(data.to);
            console.log("sendUserSocket: ", sendUserSocket);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("incoming-voice-call", {
                    from: data.from,
                    roomId: data.roomId,
                    callType: data.callType,
                });
            }
        });
        socket.on("outgoing-video-call", data => {
            const sendUserSocket = (0, exports.getReceiverSocketId)(data.to);
            console.log("outgoing video call , data to: ", data === null || data === void 0 ? void 0 : data.to);
            console.log("outgoing video call , data: ", data);
            console.log("sendUserSocket: ", sendUserSocket);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("incoming-video-call", {
                    from: data.from,
                    roomId: data.roomId,
                    callType: data.callType,
                });
            }
        });
        socket.on("reject-video-call", data => {
            console.log("reject-video call , data: ", data);
            const sendUserSocket = (0, exports.getReceiverSocketId)(data.from);
            console.log("Send user socket , reject-video-call : ", sendUserSocket);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("video-call-rejected");
            }
        });
        socket.on("reject-voice-call", data => {
            console.log("reject-voice call , data: ", data);
            const sendUserSocket = (0, exports.getReceiverSocketId)(data.from);
            console.log("Send user socket,reject-voice-call: ", sendUserSocket);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("voice-call-rejected");
            }
        });
        socket.on("accept-incoming-call", ({ id }) => {
            console.log("accept-incoming call , id: ", id);
            const sendUserSocket = (0, exports.getReceiverSocketId)(id);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("accept-call");
            }
        });
    });
};
exports.socket = socket;
