import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { auth } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import './detail.css';
import { doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Detail = () => {

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();

  const {currentUser} = useUserStore()

  const handleBlock = async ()=>{

    if(!user) return;

    const userDocRef = doc(db,"users",currentUser.id);

    try{
        await updateDoc(userDocRef,{
          blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
        });

        changeBlock();

    } catch(err){
      console.log(err);
    }
    
  };

  return (
    <div className='detail'>
      <div className="scroll-container">
      <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <h2>{user?.username}</h2>
          {/* <p>BABA YAGA</p> */}
      </div>
      <div className="info">
        <div className="option">
            <div className="title">
              <span>Chat Settings</span>
              <img src="./arrowUp.png" alt="" />
            </div>
        </div>

        <div className="option">
            <div className="title">
              <span>Privacy & help</span>
              <img src="./arrowUp.png" alt="" />
            </div>
        </div>
        <div className="option">
            <div className="title">
              <span>Shared Photos</span>
              <img src="./arrowDown.png" alt="" />
            </div>
            <div className="photoItem">
                <div className="photoDetail">
                  <img src="./free-img.jpg" alt="" />
                  <span>free-img.jpg</span>
                </div>
                  <img src="./download.png" alt="" className='icon'/>
            </div>
            <div className="photoItem">
                <div className="photoDetail">
                  <img src="./free-img.jpg" alt="" />
                  <span>free-img.jpg</span>
                </div>
                  <img src="./download.png" alt="" className='icon'/>
            </div>


        </div>
        <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img src="./arrowUp.png" alt="" />
            </div>
        </div>

        <button onClick={handleBlock} disabled={isCurrentUserBlocked}>
                {isCurrentUserBlocked 
                  ? "You are Blocked!" 
                  : isReceiverBlocked 
                  ? "User Blocked" 
                  : "Block User"}
        </button>
        <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
      </div>
    </div>
  )
}

export default Detail