import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCards from '../components/PostCards'
import { toast } from 'react-toastify'
import { updateFollowings } from '../redux/userSlice'

const FriendProfile = () => {
   let url = import.meta.env.VITE_DEPLOYMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:9000"
  let location = useLocation()
  const dispatch = useDispatch()
  let userSlice = useSelector((state) => state.user)
  const navigate = useNavigate()
  let friendId = location.state


  const [friend, setFriend] = useState('')
  const [friendPost, setFriendPost] = useState([])


  let getFriend = async () => {
    let res = await axios.get(url+`/user/friend/${friendId}`, {
      headers: {
        Authorization: userSlice.token,
      },
    })
    let data = res.data
    // console.log(data)
    setFriend(data.friend)
    
    setFriendPost(data.friendPosts)
  }
  
  const followUnfollow = async()=>{
   let res = await axios.put(url+`/user/followUnfollow/${friendId}`,{},{
    headers:{
      'Authorization':userSlice.token
    }
   })
   let data  = res.data
   if(res.status==200){
    
     getFriend()
    toast.success(data.msg)
    dispatch(updateFollowings(friendId));
   }
  }

  useEffect(() => {
    getFriend()
  }, [friendId])

  return (
    <div className="bg-white  min-h-screen w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-10 xl:px-20">
      <div className="bg-gray-100 shadow-md">
        {/* Cover Photo */}
        <div className="relative">
          <img
            src={friend.coverPic}
            alt="Cover"
            className="w-full h-52 sm:h-72 md:h-80 lg:h-96 object-cover"
          />
          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8 flex items-center">
            <img
              src={friend.profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            <div className="ml-4 mt-8">
              <h2 className="text-xl font-bold text-white">{friend.name}</h2>
              {/* Followers/Following */}
              <div className="flex gap-6 mt-5">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">Followers</p>
                  <p className="text-lg font-bold text-gray-900 hover:underline cursor-pointer">
                    {friend?.followers?.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">Following</p>
                  <p className="text-lg font-bold text-gray-900 hover:underline cursor-pointer">
                    {friend?.followings?.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center mt-20 p-4">
        {
           friend?.followers?.includes(userSlice?.user?._id) ? <button onClick={followUnfollow} className="bg-blue-600 cursor-pointer text-white text-sm font-semibold px-4 py-2 rounded-md mr-2 hover:bg-blue-700">
            UnFollow
          </button> :
          <button onClick={followUnfollow} className="bg-blue-600 cursor-pointer text-white text-sm font-semibold px-4 py-2 rounded-md mr-2 hover:bg-blue-700">
            Add Friend
          </button>
        }
        
          <button  onClick={() => navigate("/chat",{state:friend})} className="bg-gray-200 cursor-pointer text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-300">
            Chat
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t flex space-x-4 px-8 py-2 text-sm font-semibold text-gray-600 overflow-hidden">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2">Posts</button>
          {/* <button>About</button>
          <button>Friends</button>
          <button>Photos</button>
          <button>Videos</button>
          <button>Reels</button>
          <button>More</button> */}
        </div>

        {/* Posts */}
        <div className=" flex flex-col  w-[350px]  sm:w-[400px] gap-4 ">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4  ml-10 mt-5">
            {friendPost.map((ele) => (
              <PostCards getAllPosts={getFriend} key={ele._id} ele={ele} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendProfile
