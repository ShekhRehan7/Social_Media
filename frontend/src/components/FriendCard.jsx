import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const FriendCard = (props) => {


  const [friend, setfriend] = useState ("");
  const friendId  = props.element._id
  

  let userSlice = useSelector((state)=>state.user)
  // console.log(userSlice.user)

   const followUnfollow = async()=>{
   let res = await axios.put(`http://localhost:9000/user/followUnfollow/${friendId}`,{},{
    headers:{
      'Authorization':userSlice.token
    }
   })
   let data  = res.data
   if(res.status==200){
    toast.success(data.msg)
    // console.log(data)
     getFriend()
   }
  }

   let getFriend = async () => {
    let res = await axios.get(`http://localhost:9000/user/friend/${friendId}`, {
      headers: {
        "Authorization": userSlice.token,
      },
    })
    let data = res.data
    // console.log(data.friend)
    setfriend(data.friend)
   
  }

  useEffect(()=>{
    getFriend()
  },[])



  return (
   <div className="w-[250px] bg-white rounded-lg shadow-md overflow-hidden border">
   <Link to={"/friendProfile"} state={friendId}>
      <img
        src={props.element.profilePic}
        alt="User"
        className="w-full h-50 object-cover "
      />
   </Link>
      <div className="p-3">
        <h3 className="text-lg font-semibold capitalize">{props.element.name}</h3>
        <div className="mt-3 flex justify-between gap-2">
          { friend?.followers?.includes(userSlice?.user?._id) ?
            <button onClick={followUnfollow} className="bg-blue-600 text-white rounded-md px-4 py-1 text-sm font-semibold hover:bg-blue-700 w-full">
            UnFollow
          </button>:
           <button onClick={followUnfollow} className="bg-blue-600 text-white rounded-md px-4 py-1 text-sm font-semibold hover:bg-blue-700 w-full">
            Add Friend
          </button>}
          
        </div>
      </div>
    </div>
  )
}

export default FriendCard