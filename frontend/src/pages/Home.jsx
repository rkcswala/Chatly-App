
import Sidebar from "../components/Sidebar";
import MessageBox from "../components/Messagebox";
import Getmessage from "../customhook/Getmessage";
import Currentuser from "../customhook/Currentuser";
import { useSelector } from "react-redux";

const Home = () => {

  const selecteduser = useSelector((state) => state.user.selecteduser);

  return (
    <div className={`home ${selecteduser ? "chat-open" : ""}`}>
      <Currentuser />
      <Getmessage  />
      <Sidebar  />
      <MessageBox />
    </div>
  );
};

export default Home;
