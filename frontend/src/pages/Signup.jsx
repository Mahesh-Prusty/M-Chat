import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { server_URL } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Signup = () => {
  let navigate = useNavigate();
  let [show, setShow] = useState(true);
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        `${server_URL}/api/auth/signup`,
        {
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-125 h-150 bg-white rounded-lg shadow-gray-600 shadow-lg flex flex-col items-center gap-3">
        <div className="flex justify-center items-center w-full h-50 bg-blue-400 rounded-b-[40%] shadow-gray-700 shadow-lg">
          <h1 className="text-3xl font-bold">
            Welcome to
            <span className=" text-white"> M-Chat</span>
          </h1>
        </div>
        <form
          action=""
          className="w-full flex flex-col items-center gap-4 mt-2.5"
          onSubmit={handleSignup}
        >
          <input
            type="text"
            placeholder="Username"
            className="w-[90%] h-15 outline-none border-2 border-[#1344c1] rounded-lg shadow-gray-600 px-2.5 py-2.5"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            className="w-[90%] h-15 outline-none border-2 border-[#1344c1] rounded-lg shadow-gray-600 px-2.5 py-2.5"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="w-[90%] h-15 outline-none border-2 border-[#1344c1] rounded-lg shadow-grey-600 px-2.5 py-2.5 flex items-center">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-[95%] h-15 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShow((prev) => !prev)}
              className="cursor-pointer"
            >
              {show ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            disabled={loading}
            className="px-2.5 py-5 active:shadow-inner bg-blue-500 text-white font-bold shadow-gray-500 shadow-lg rounded-lg w-35 h-12 text-[18px] flex text-center justify-center items-center cursor-pointer"
          >
            {loading ? "Loading..." : "Signup"}
          </button>
          <p className="cursor-pointer" onClick={() => navigate("/login")}>
            Already have an account ?{" "}
            <span className="font-bold text-blue-500 ">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
