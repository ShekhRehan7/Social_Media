import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { GoAlert } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { io } from "socket.io-client";

const Chat = () => {
  let url = import.meta.env.VITE_DEPLOYMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:9000"

  const location = useLocation();
  const friend = location.state;
  const friendId = friend._id;

  const socket = useRef();
  const inputRef = useRef();
  const bottomRef = useRef();
  const userSlice = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [view, setview] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);

  const sendMessage = async () => {
    const val = inputRef.current.value.trim();
    if (!val) return;

    try {
      const res = await axios.post(
        url + `/message/create/${friendId}`,
        { text: val },
        {
          headers: { Authorization: userSlice.token },
        }
      );
      inputRef.current.value = "";
      const newMsg = res.data.message;
      setMessages((prev) => [...prev, newMsg]);

      // ✅ Emit with senderId for proper identification on receiver side
      socket.current.emit("sendMessage", {
        ...newMsg,
        senderId: userSlice.user._id,
        receiverId: friendId,
      });

    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  const getMessages = async () => {
    try {
      const res = await axios.get(
        url + `/message/getMessage/${friendId}`,
        {
          headers: { Authorization: userSlice.token },
        }
      );
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Get messages error:", error);
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      await axios.delete(url + `/message/delete/${msgId}`, {
        headers: { Authorization: userSlice.token },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      setview(false);
    } catch (error) {
      console.error("Delete message error:", error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [friendId]);

  useEffect(() => {


    // ✅ Connect to socket
    socket.current = io(url, {
      transports: ["websocket"],
    });

    // ✅ Join room with user & friend
    socket.current.emit("joinRoom", {
      userId: userSlice.user._id,
      friendId: friendId,
    });

    // ✅ Receive messages
    socket.current.on("receiveMessage", (data) => {
      console.log("Real-time message received:", data);
      if (data?.senderId === friendId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    
    return () => {
      socket.current.disconnect();
    };
  }, [friendId, userSlice.user._id]);



useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

return (
  <div className="flex-1 sm:p-6 justify-between flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between py-3 border-b-2 border-gray-200 px-4 border">
      <div className="relative flex items-center space-x-4">
        <div className="relative">
          <span className="absolute text-green-500 right-0 bottom-0">
            <svg width={20} height={20}>
              <circle cx={8} cy={8} r={8} fill="currentColor" />
            </svg>
          </span>
          <img
            src={friend.profilePic}
            alt="profile"
            className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-2xl mt-1 flex items-center">
            <span className="text-gray-700 mr-3">{friend.name}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-100">
      {messages.map((msg) => {
        const isMe = msg?.userId === userSlice.user._id;
        return (
          <div key={msg?._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div className="flex flex-col max-w-xs relative group">
              <div
                className={`px-4 py-2 rounded-lg text-white ${isMe ? "bg-blue-500" : "bg-gray-500"}`}
              >
                {msg?.text}
              </div>
              <span className="text-xs text-gray-500 mt-1 ml-1">
                {format(msg?.createdAt)}
              </span>

              {isMe && (
                <button
                  onClick={() => {
                    setview(true);
                    setSelectedMsgId(msg._id);
                  }}
                  className="absolute -top-2 -right-2 px-1 py-1 bg-red-500 text-white rounded-full transition"
                  title="Delete"
                >
                  <MdDelete size={15} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {view && (
        <div className="mx-auto h-50 bg-white w-[300px] sm:w-[350px] rounded-2xl">
          <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <GoAlert size={35} color="red" />
            <h1 className="text-3xl">Message Delete</h1>
            <div className="flex gap-2 mt-5 items-center justify-center w-full">
              <button
                onClick={() => deleteMessage(selectedMsgId)}
                className="rounded-lg text-xl px-4 py-2 text-white bg-red-500 hover:bg-red-400"
              >
                Delete
              </button>
              <button
                onClick={() => setview(false)}
                className="rounded-lg text-xl px-4 py-2 text-white bg-red-500 hover:bg-red-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef}></div>
    </div>

    {/* Input */}
    <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex">
        <input
          type="text"
          placeholder="Write your message!"
          ref={inputRef}
          className="w-full focus:outline-none text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          type="button"
          className="ml-2 inline-flex items-center justify-center rounded-lg px-4 py-3 text-white bg-blue-500 hover:bg-blue-400"
        >
          <span className="font-bold">Send</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6 ml-2 transform rotate-90"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);
};

export default Chat;
