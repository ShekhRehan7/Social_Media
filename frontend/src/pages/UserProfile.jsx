import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updatePic } from '../redux/userSlice';
import { IoCamera } from "react-icons/io5";
import PoastUploder from '../components/PostUploader';
import PostCards from '../components/PostCards';
import PostUploader from '../components/PostUploader';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const userSlice = useSelector((state) => state.user);
  // console.log(userSlice)
  const user = userSlice?.user;
  const dispatch = useDispatch();
  const [allPost, setallPost] = useState([]);

  const handleCoverChanger = async (e, name) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDNAME}/upload`,
        formData
      );

      const url = res.data.secure_url;

      const res1 = await axios.put(
        'http://localhost:9000/user/update',
        { [name]: url },
        {
          headers: {
            Authorization: userSlice.token,
          },
        }
      );

      if (res1.status === 200) {
        dispatch(updatePic({ name, url }));
        //  dispatch(fetchUserByToken(userSlice?.token))
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const yourPost = async () => {
    let res = await axios.get('http://localhost:9000/post/yourPost', {
      headers: {
        "Authorization": userSlice.token
      }
    });
    setallPost(res.data.post);
  };




 

  useEffect(() => {
    yourPost();
  }, [userSlice?.token]);

  return (
    <div className='bg-white min-h-screen w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-10 xl:px-20'>
      <div className="bg-gray-200 min-h-screen font-sans ">
      {/* Cover Photo */}
      <div className="relative ">
        <img
          src={user.coverPic}
          alt="Cover"
          className="w-full h-52 sm:h-72 md:h-80 lg:h-96 object-cover"
        />
        <div className="absolute left-4 sm:left-10 -bottom-16">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-center"
          />
        </div>
        <div className="absolute right-4 sm:right-10 bottom-3 ">
          <input
            onChange={(e) => handleCoverChanger(e, 'coverPic')}
            type="file"
            id="cover"
            hidden
          />
          <label
            htmlFor="cover"
            className="bg-white text-black px-2 sm:px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2"
          >
            <IoCamera size={20} color="black" />
            <span className="hidden sm:inline">Edit cover photo</span>
          </label>
        </div>
        <div className="absolute left-24 sm:left-36">
          <input
            onChange={(e) => handleCoverChanger(e, 'profilePic')}
            type="file"
            id="profile"
            hidden
          />
          <label
            htmlFor="profile"
            className="bg-white p-2 rounded-full shadow cursor-pointer flex items-center"
          >
            <IoCamera size={20} color="black" />
          </label>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 sm:pt-24 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-4 ml-17 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
          <div className=' mt-5 flex items-center gap-8'>
            <div className='flex flex-col items-center gap-2' >
               <h1 className='font-bold text-lg'>Followers</h1>
              <p className='font-bold text-lg'>{userSlice?.user?.followers?.length}</p>
            </div>
             <div className='flex flex-col items-center gap-1'>
              <h1  className='font-bold text-lg'>Followings</h1>
              <p className='font-bold text-lg'>{userSlice?.user?.followings?.length}</p>
            </div>
          </div>
          
        </div>
        <div className="space-x-2 ml-5">
          <button className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded">
            Add to Story
          </button>
          <Link to={"/editprofile"} className="border border-gray-300 bg-white px-3 py-1 sm:px-4 sm:py-2 rounded mr-2">
            Edit Profile
          </Link>
        </div>
      </div>
      


    

      {/* Main Content */}
      <div className="px-2 py-2 grid xl:grid-cols-3 lg:grid-cols-3 lg:gap-5 mt-2  ">
        {/* Left Sidebar */}
        <div className="space-y-6 ">
          {/* <div className="bg-white w-[350px] sm:w-[400px] px-4 py-3 rounded-xl">
            <h2 className="font-bold text-lg mb-3">Intro</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-200 rounded-md font-bold">Add Bio</button>
              <button className="w-full px-4 py-2 bg-gray-200 rounded-md font-bold">Edit details</button>
              <button className="w-full px-4 py-2 bg-gray-200 rounded-md font-bold">Add Featured</button>
            </div>
          </div> */}

          <div className="bg-white px-4 w-[300px]  sm:w-[400px] py-3 rounded-xl">
  <h2 className="font-bold text-lg mb-2">Photos</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3  gap-2">
    {allPost
      .flatMap(post => post.files)  // This extracts all files from posts into one array
      .map((file, i) => (
        <img key={i} src={file} alt={`Photo ${i}`} className="h-34 w-full object-cover rounded" />
      ))
    }
  </div>
</div>


          {/* <div className="bg-white w-[300px] md:w-[400px] px-4 py-3 rounded-xl">
            <h2 className="font-bold text-lg mb-2">Friends</h2>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Content */}
        <div className="relative lg:col-span-2 space-y-4 mt-2">
          <div className='w-[300px]  sm:w-[400px]   lg:ml-35   xl:w-[500px] xl:ml-35 '>
            <PostUploader />
          </div>
          <div className="flex flex-col w-[300px]  sm:w-[400px] gap-4 lg:ml-35 xl:ml-58">
              <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
  {
    allPost.map((ele, i) => (
      <PostCards key={ele._id} ele={ele}  getAllPosts={yourPost}  />
    ))
  }
</div>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
