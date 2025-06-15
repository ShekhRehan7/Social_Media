import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateProfile } from "../redux/userSlice";

const EditProfile = () => {
   let url = import.meta.env.VITE_DEPLOYMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:9000"
  const userSlice = useSelector((state) => state.user);
  const dispatch = useDispatch();

 let nameRef = useRef();
 let passwordRef = useRef();

  // Set default name when component mounts or user name changes
//   useEffect(() => {
//     setProfile((prev) => ({
//       ...prev,
//       name: "",
//     }));
//   }, [userSlice.user.name]);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {
        name:nameRef.current.value,
        password:passwordRef.current.value,
    }


    try {
      const res = await axios.put(
        url+`/user/update`,
       obj,
        {
          headers: {
            Authorization: userSlice.token,
          },
        }
      );

      dispatch(updateProfile(res.data.user));
    //   console.log(res.data.user)
      toast.success(res.data.msg );

       if (passwordRef.current || nameRef.current) {
        nameRef.current.value = "";
        passwordRef.current.value = "";
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Error updating profile");
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Form Section */}
        <form
         
          className="p-8 flex flex-col justify-center gap-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Edit Your Profile
          </h2>

          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            ref={nameRef}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />

          <label className="text-sm text-gray-600">New Password</label>
          <input
            type="password"
            ref={passwordRef}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />

          <button
           onClick={handleSubmit}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            Update Profile
          </button>
        </form>

        {/* Live Preview Section */}
        <div className="bg-gradient-to-tr from-blue-500 to-purple-600 text-white p-8 flex flex-col justify-center items-center">
          <img
            src={userSlice.user.profilePic}
            alt="Preview Avatar"
            className="w-24 h-24 rounded-full mb-4 shadow-md"
          />
          <h3 className="text-xl font-bold">{userSlice.user.name}</h3>
          {/* <p className="text-sm mt-1">
            
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
