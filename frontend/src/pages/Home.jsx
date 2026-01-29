// import { useSelector } from "react-redux";
import { GetMessages } from "../../customHooks/GetMessages";
import { GetOtherUsers } from "../../customHooks/GetOtherUsers";
import MessageArea from "../components/MessageArea";
import Sidebar from "../components/Sidebar";

const Home = () => {
  // let { selectedUser } = useSelector((state) => state.user);
  GetOtherUsers();
  GetMessages();
  return (
    <div className="w-full h-screen flex overflow-hidden">
      <Sidebar />
      <MessageArea />
    </div>
  );
};

export default Home;
