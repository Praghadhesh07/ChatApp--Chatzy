import List from "./components/list/list.jsx";
import Chat from "./components/chat/chat.jsx";
import Detail from "./components/detail/detail.jsx";
import Login from "./components/login/login.jsx";
import Notification from "./components/notification/Notification.jsx";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase.js";
import { useUserStore } from "./lib/userStore.js";
import { useChatStore } from "./lib/chatStore.js";

const App = () => {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatStore();

  useEffect(()=>{
      const unSub = onAuthStateChanged(auth,(user)=>{
          fetchUserInfo(user?.uid);
      });

      return ()=>{
        unSub();
      }
  },[fetchUserInfo]);


// if(isLoading) return <div className="loading">Loading...</div>;

if (isLoading) {
  return (
    <div className="loading-overlay">
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}


  return (
    <div className='container'>
      {
        currentUser ? (
          <>
              <List />
              {chatId && <Chat />}
              {chatId && <Detail />}
          </>
        ) : (
        <Login />
      )
    }
    <Notification />

    </div>
  );
};

export default App;