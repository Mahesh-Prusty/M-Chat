import { IoCameraOutline } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { server_URL } from "../main";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  let { userData } = useSelector((state) => state.user);
  let navigate = useNavigate();
  let [name, setName] = useState(userData.name || "");
  let [frontendImage, setFrontendImage] = useState(userData.image || dp);
  let [backendImage, setBackendImage] = useState(null);
  let image = useRef();
  let dispatch = useDispatch();
  let [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.put(`${server_URL}/api/user/profile`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSaving(false);
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-300 flex flex-col justify-center items-center">
      <div>
        <FaChevronLeft
          className="fixed top-7 left-10 text-4xl text-blue-900 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div
        onClick={() => image.current.click()}
        className="w-50 h-50 rounded-full bg-white border-3 border-blue-500 shadow-gray-500 shadow-lg relative cursor-pointer hover:shadow-inner"
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={frontendImage}
            alt="Default Picture"
            className="rounded-full h-full w-full"
          />
        </div>
        <div className=" text-4xl text-gray-700 shadow-lg shadow-gray-500 absolute bottom-4 right-6 cursor-pointer h-9 w-9 bg-blue-500 flex justify-center items-center rounded-full">
          <IoCameraOutline className=" text-4xl text-white cursor-pointer h-7 w-7 shadow-gray-500" />
        </div>
      </div>
      <form
        action=""
        className="w-[95%] h-100 max-w-125 flex flex-col gap-5 justify-center items-center"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handleImage}
        />
        <input
          type="text"
          placeholder="Enter your name"
          className="w-[90%] h-15 outline-none border-2 border-[#1344c1] rounded-lg shadow-gray-700 shadow-lg px-2.5 py-2.5"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="text"
          readOnly
          className="w-[90%] h-15 text-gray-500 outline-none border-2 border-[#1344c1] rounded-lg shadow-gray-700 shadow-lg px-2.5 py-2.5"
          value={userData.userName}
        />
        <input
          type="email"
          readOnly
          className="w-[90%] h-15 text-gray-500 outline-none border-2 border-[#1344c1] rounded-lg shadow-gray-700 shadow-lg px-2.5 py-2.5"
          value={userData.email}
        />
        <button
          disabled={saving}
          className="px-2.5 py-5 bg-blue-500 active:shadow-inner text-white font-bold shadow-gray-500 shadow-lg rounded-lg w-35 h-12 text-[18px] flex text-center justify-center items-center cursor-pointer"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
