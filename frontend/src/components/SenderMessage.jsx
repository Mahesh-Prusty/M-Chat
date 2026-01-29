import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";
const SenderMessage = ({ image, message }) => {
  let scroll = useRef(null);
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, image]);
  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex items-start gap-3">
      <div
        ref={scroll}
        className=" ml-auto w-fit max-w-125 flex flex-col gap-2 px-5 py-2 text-[18px] bg-[#4552ac] text-white rounded-tr-none rounded-2xl shadow-gray-800 shadow-lg"
      >
        {image && (
          <img
            src={image}
            alt=""
            className="h-50 w-50 rounded-lg"
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-gray-900 flex justify-center items-center cursor-pointer">
        <img
          src={userData.image || dp}
          alt="Default Picture"
          className="rounded-full h-full w-full "
        />
      </div>
    </div>
  );
};

export default SenderMessage;
