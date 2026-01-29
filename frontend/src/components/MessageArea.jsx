import { FaChevronLeft } from "react-icons/fa";
import { RiEmojiStickerFill } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
// import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { useRef, useState, useEffect } from "react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { server_URL } from "../main.jsx";
import axios from "axios";
import { setMessages } from "../redux/messageSlice.js";

const MessageArea = () => {
  let dispatch = useDispatch();
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);
  let image = useRef();
  let { messages } = useSelector((state) => state.message);

  const handleImage = async (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backendImage) return;
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.post(
        `${server_URL}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };
  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(true);
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, setMessages]);
  return (
    <div
      className={`lg:w-[70%] ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-screen bg-slate-400 border-1-2 border-gray-500 relative`}
    >
      {selectedUser && (
        <div
          onClick={() => setShowPicker(false)}
          className="w-full h-160 bg-slate-400"
        >
          <div className="w-full h-30 bg-[#555d8f] rounded-b-[8%] shadow-gray-900 shadow-lg gap-2 p-4">
            <div className="flex gap-5 items-center">
              <FaChevronLeft
                className="text-4xl h-8 w-8 mt-2 ml-2 shadow-gray-900 rounded-full active:shadow-inner shadow-lg cursor-pointer text-white"
                onClick={() => dispatch(setSelectedUser(null))}
              />
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-gray-900 flex justify-center items-center">
                <img
                  src={selectedUser?.image || dp}
                  alt="Default Picture"
                  className="rounded-full h-full w-full "
                />
              </div>
              <h1 className="text-white font-semibold text-[25px]">
                {selectedUser?.name || "User"}
              </h1>
            </div>
          </div>
          <div className="w-full h-[76vh] flex flex-col gap-3 py-6 px-4 overflow-auto">
            {showPicker && (
              <div className="absolute bottom-22 left-2 z-50">
                <EmojiPicker
                  width={260}
                  height={350}
                  className="shadow-gray-800 shadow-lg"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
            {messages?.map((mess) =>
              mess.sender === userData._id ? (
                <SenderMessage
                  key={mess._id}
                  image={mess.image}
                  message={mess.message}
                />
              ) : (
                <ReceiverMessage
                  key={mess._id}
                  image={mess.image}
                  message={mess.message}
                />
              ),
            )}
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="w-full h-full flex flex-col justify-center items-center gap-10 shadow-gray-500">
          <h1 className="font-bold text-gray-950 text-5xl">
            Welcome to <span className="text-blue-950">M-Chat</span>
          </h1>
          <span className="text-2xl text-violet-90">
            Click on profile to chat
          </span>
        </div>
      )}
      {selectedUser && (
        <div className="w-full lg:w-[70%] h-20 fixed bottom-2 flex items-center justify-center">
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Image"
              className="absolute w-40 bottom-20 right-[8%] rounded-lg shadow-gray-800 shadow-lg"
            />
          )}
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSendMessage}
            className="w-[95%] lg:w-[80%] h-15 px-5 py-2 bg-[#555d8f] shadow-gray-700 shadow-lg rounded-full flex items-center gap-6 text-white text-2xl"
          >
            <div
              onClick={() => setShowPicker((prev) => !prev)}
              className="cursor-pointer"
            >
              <RiEmojiStickerFill />
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={image}
              onChange={handleImage}
            />
            <div className="h-full w-full  bg-[#555d8f] rounded-full ">
              <input
                type="text"
                placeholder="Message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                className="w-full h-full outline-none px-2 text-black text-[18px] placeholder-white"
              />
            </div>
            <div
              onClick={() => image.current.click()}
              className="cursor-pointer"
            >
              <FaRegImages className="cursor-pointer" />
            </div>
            {(input.length > 0 || backendImage != null) && (
              <button className="cursor-pointer">
                <IoSend />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
