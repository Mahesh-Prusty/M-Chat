import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { server_URL } from "../src/main";
import { setOtherUsers } from "../src/redux/userSlice";

export const GetOtherUsers = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${server_URL}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [dispatch]);
};
