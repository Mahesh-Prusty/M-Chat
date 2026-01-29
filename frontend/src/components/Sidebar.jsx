import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import axios from "axios";
import { server_URL } from "../main";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);

  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${server_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(`Logout Error : ${error}`);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${server_URL}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.log(`Search Error : ${error}`);
    }
  };

  useEffect(() => {
    if (input) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] w-full relative bg-slate-300 flex flex-col items-center ${
        !selectedUser ? "block" : "hidden"
      } h-screen lg:block overflow-hidden`}
    >
      {/* Logout */}
      <div
        onClick={handleLogout}
        className="w-13 h-13 cursor-pointer bg-blue-400 text-[20px] rounded-full shadow-lg shadow-gray-900 flex justify-center items-center fixed left-2 bottom-2 active:shadow-inner"
      >
        <RiLogoutCircleLine className="w-6 h-6" />
      </div>

      {/* Search Results */}
      {input && (
        <div className="absolute top-64 w-full max-h-80 overflow-y-auto bg-white z-40 flex flex-col gap-3">
          {searchData?.map((user) => (
            <div
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className="flex items-center h-13 w-[85%] mx-auto bg-red-50 gap-[20%] shadow-lg mt-4 rounded-full cursor-pointer hover:bg-gray-300 text-[18px] font-black text-blue-950 shrink-0"
            >
              {/* Avatar + Green Dot */}
              <div className="relative w-13 h-13 rounded-full shadow-lg shadow-gray-900 flex justify-center items-center">
                <img
                  src={user.image || dp}
                  alt="User"
                  className="rounded-full h-full w-full object-cover"
                />
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full shadow-md" />
                )}
              </div>

              <div>{user.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex w-full h-60 bg-blue-400 rounded-b-[15%] shadow-lg flex-col gap-2">
        <h1 className="text-white font-bold text-3xl mt-2 ml-2">M-Chat</h1>

        <div className="flex w-full justify-around items-center">
          <h1 className="text-2xl text-black">
            Hey <span className="font-bold">{userData?.name || "User"}</span>
          </h1>

          <div
            onClick={() => navigate("/profile")}
            className="w-25 h-25 rounded-full overflow-hidden shadow-lg shadow-gray-900 cursor-pointer"
          >
            <img
              src={userData?.image || dp}
              alt="Profile"
              className="rounded-full h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Search Bar + Online Avatars */}
        <div className="w-full flex items-center gap-4 px-2">
          {!search && (
            <div
              onClick={() => setSearch(true)}
              className="w-12 h-12 cursor-pointer bg-white rounded-full shadow-lg shadow-gray-900 flex justify-center items-center"
            >
              <IoSearch className="w-6 h-6" />
            </div>
          )}

          {search && (
            <form className="w-[95%] h-12 rounded-full bg-white shadow-lg shadow-gray-900 flex items-center gap-2 px-3">
              <IoSearch className="w-6 h-6" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full h-full outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2
                className="w-6 h-6 cursor-pointer"
                onClick={() => {
                  setSearch(false);
                  setInput("");
                }}
              />
            </form>
          )}

          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    key={user._id}
                    onClick={() => dispatch(setSelectedUser(user))}
                    className="relative w-12 h-12 rounded-full shadow-lg shadow-gray-900 cursor-pointer"
                  >
                    <img
                      src={user.image || dp}
                      alt="User"
                      className="rounded-full h-full w-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                )
            )}
        </div>
      </div>

      {/* Sidebar User List */}
      {!search &&
        otherUsers?.map((user) => (
          <div
            key={user._id}
            onClick={() => dispatch(setSelectedUser(user))}
            className="flex items-center h-13 w-[83%] bg-red-50 gap-[20%] shadow-lg shadow-gray-700 active:shadow-inner mt-4 mx-auto rounded-full cursor-pointer hover:bg-gray-300 text-[18px] font-black text-blue-950"
          >
            {/* Avatar + Green Dot */}
            <div className="relative w-13 h-13 rounded-full shadow-lg shadow-gray-900 flex justify-center items-center">
              <img
                src={user.image || dp}
                alt="User"
                className="rounded-full h-full w-full object-cover"
              />
              {onlineUsers?.includes(user._id) && (
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full shadow-md" />
              )}
            </div>

            <div>{user.name}</div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;