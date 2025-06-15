import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {setState} from'../redux/userSlice'


const Login = () => {
   let url = import.meta.env.VITE_DEPLOYMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:9000"
   
  const dispatch =useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [details, setdetails] = useState({
    email:'',
    password:''
  });

  const handleChanger = (e)=>{

    setdetails({...details , [e.target.name] : e.target.value})
  }

  const handleSubmit =async(e)=>{
    e.preventDefault()
    try {
       let res = await axios.post(url+'/user/login',details)
      //  console.log(res)
       let data = res.data
       if(res.status==200 || res.status==201){
        // console.log(data)
        toast.success(data.msg)
        dispatch(setState(data))
      }

    } catch (error) {
      // console.log(error)
      toast.error(error?.response?.data?.msg || 'Something went wrong')
    }
  }

  return (
    <>
    <div className="h-[90.6vh]  bg-[url(bg-image.jpg)] bg-center bg-cover bg-blue-300 flex justify-center items-center gap-5 ">
      <form className="bg-white p-6 rounded-2xl shadow-lg lg:w-[25%]  ">
        <div className="text-center mb-6 flex flex-col items-center  gap-2">
          <img src="/logo-black.png" alt="" className='w-35 mr-6' />
          <h2 className="text-2xl font-bold">Login</h2>
        </div>
        <input onChange={handleChanger} name='email' type="email" placeholder="Email" className="w-full mb-2  p-3 border rounded-xl" />    
        <div className="relative">
            <input onChange={handleChanger} name='password' type={showPassword ? "text" : "password"} placeholder="Password" className="w-full mt-1 mb-2 p-3 border rounded-xl pr-10"/>
             <button type="button" className="absolute right-3 top-5 text-gray-500" onClick={() => setShowPassword(!showPassword)}              >
                {showPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
               </button>
          </div>
               
        <div className="flex justify-between items-center text-sm mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <Link to={'/forget'} className="text-blue-500">Forgot Password?</Link>
        </div>
        <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold cursor-pointer">Log In</button>
        <div className="my-4 text-center text-gray-400">Or</div>
       
        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-xl cursor-pointer">
          <img src="https://img.icons8.com/color/16/000000/facebook-new.png" alt="Facebook" /> Continue with Facebook
        </button>

        <p className="text-sm mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 font-medium">Sign Up</Link>
          </p>

      </form>
    </div>
    </>
  )
}

export default Login