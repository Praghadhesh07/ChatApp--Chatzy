import React, { useEffect, useRef, useState } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import {arrayUnion, doc, onSnapshot, updateDoc, getDoc} from 'firebase/firestore';
import {db} from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
      file:null,
      url:"",
  });

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
  const {currentUser} = useUserStore();


  const endRef = useRef(null);

 useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat?.messages]);


  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats", chatId), (res)=>{
        setChat(res.data())
    })

    return () =>{
      unSub()
    }
  },[chatId])

  console.log(chat)

  const handleEmoji = e =>{
    setText((prev) => prev + e.emoji);
    // setOpen(false)
  }

  const handleImg = (e) =>{
   if(e.target.files[0]){
        setImg(
        {
          file:e.target.files[0],
          url: URL.createObjectURL(e.target.files[0])
        }
      )
   }
  } 

  const handleDelete = async (messageToDelete) => {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);
  const messages = chatSnap.data().messages || [];

  const updatedMessages = messages.filter(
    (msg) => msg.createdAt !== messageToDelete.createdAt
  );

  await updateDoc(chatRef, {
    messages: updatedMessages,
  });
};


  const handleSend = async ()  =>{
      if (text === "" && !img.file) return;

      let imgUrl = null;

      try{

        if(img.file)
        {
          imgUrl = await upload(img.file)
        }

        await updateDoc(doc(db,"chats",chatId),{
            messages:arrayUnion({
              senderId: currentUser.id,
              text,
              createdAt: new Date(),
              ...(imgUrl && {img: imgUrl}),
            })
        })

        const userIds = [currentUser.id,user.id];

        userIds.forEach(async(id)=>{
          
          const userChatsRef = doc(db,"userChats",id)
          const userChatsSnapshot = await getDoc(userChatsRef)
          
          if(userChatsSnapshot.exists()){
            const userChatsData = userChatsSnapshot.data()
            
            const chatIndex = userChatsData.chats.findIndex(c=>c.chatId === chatId)
            
            if(chatIndex !== -1){
              userChatsData.chats[chatIndex].lastMessage = text;
              userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
              userChatsData.chats[chatIndex].updatedAt = Date.now();
              
              await updateDoc(userChatsRef, {
                chats: userChatsData.chats,
              })
            }
          }
        })    
        } catch(err){
          console.log(err)
        }

        setImg({
           file: null,
           url:"",
        });

        setText("");
      }
      
  return (

    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            {/* <p>Baba Yaga</p> */}
          </div>
        </div>

        <div className="icons">
          <img src="./video.png" alt="" />
          <img src="./phone.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

  <div className="scroll-container">
      <div className="center">
        {chat?.messages?.map((message) => {
  const isOwn = message.senderId === currentUser?.id;
  const avatar = isOwn ? currentUser.avatar : user?.avatar;
  return (
   <div className={isOwn ? "message-own" : "message"} key={message?.createdAt}>
  {/* Avatar */}
  <img
    className="message-avatar"
    src={avatar || "./avatar.png"}
    alt="avatar"
  />

  {/* Message bubble */}
  <div className="texts">
    {message.img && <img src={message.img} />}
    {message.text && <p>{message.text}</p>}
    
  </div>
</div>

  );
})}

      </div>

      {/* { img.url && (<div className="message--own">
        <div className="texts">
          <img src={img.url} alt="" />
        </div>
      </div>)} */}

      <div ref={endRef}></div>
  </div> 
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file" className={isCurrentUserBlocked || isReceiverBlocked ? "disabled-label" : ""}>
            <img src="img.png" alt="" />
          </label>
          <input type='file' id='file' style={{display:'none'}} onChange={handleImg} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
          <img src="camera.png" id='cam'  alt="" className={isCurrentUserBlocked || isReceiverBlocked ? "disabled-icon" : ""}/>
          <img src="mic.png"  id='mic' alt="" className={isCurrentUserBlocked || isReceiverBlocked ? "disabled-icon" : ""}/>
        </div>

        <input
          type='text'
          placeholder={isCurrentUserBlocked || isReceiverBlocked 
                        ? "You cannot send a message" 
                        : 'Type a message...'}           
          className='chatInput'
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        
        <div className="emoji" >
          <img src="./emoji.png" alt="" className={isCurrentUserBlocked || isReceiverBlocked ? "disabled-icon" : ""} onClick={() => setOpen((prev) => !prev) }  />
          <div className="picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  );
};

export default Chat;