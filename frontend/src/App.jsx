import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { GetCurrentUser } from "../customHooks/GetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { GetOtherUsers } from "../customHooks/GetOtherUsers";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { server_URL } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

function App() {
  GetCurrentUser();
  GetOtherUsers();
  let { userData, socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${server_URL}`, {
        query: {
          userID: userData?._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio.on("GetOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socketio.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/profile" />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
      </Routes>
    </>
  );
}

export default App;
