import './userInfo.css';
import {useUserStore} from "../../../lib/userStore";

const Userinfo = () => {

  const {currentUser} = useUserStore();

  return (
    <div className='UserInfo'>
        <div className='user'>
            <img src={currentUser.avatar || "./avatar.png"} alt="" />
            <h3>{currentUser.username}</h3>
        </div>
        <div className='icons'>
            <img src="./edit.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./more.png" alt="" />
        </div>
    </div>

  )
}

export default Userinfo