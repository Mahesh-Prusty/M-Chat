import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server_URL } from "../src/main";
import { setMessages } from "../src/redux/messageSlice";

export const GetMessages = () => {
  let dispatch = useDispatch();
  let { selectedUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (!selectedUser?._id) return;
    const fetchMessages = async () => {
      try {
        let result = await axios.get(
          `${server_URL}/api/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          },
        );
        dispatch(setMessages(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [dispatch, selectedUser?._id]);
  return null;
};
