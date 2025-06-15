import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { toast } from 'react-toastify';
import axios from 'axios';


const Signup = () => {
   let url = import.meta.env.VITE_DEPLOYMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:9000"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    name:'',
    email:'',
    password:'',
    cpassword:''
  });

  const handleChanger = (e)=>{
    
    // console.log(e.target)  // tag
      // console.log(e.target.value)  // tag value
      // console.log(e.target.name)  // tag name attribute
     setDetails({...details , [e.target.name] : e.target.value})
  }

  const handleSubmit = async(event)=>{
   try {
    event.preventDefault()
    if(!details.name){
      return toast.warning("User Name is required")
    }
    if(!details.email){
      return toast.warning("Email is required")
    }
    if(!details.password){
      return toast.warning("Password is required")
    }
    if(!details.cpassword){
      return toast.warning("Confirm Password is required")
    }
    if(details.cpassword !== details.password){
      return toast.error("Password does not match")
    }

    //regex , string match in js
    let pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let emailCheck = pattern.test(details.email)
    if(!emailCheck){
      return toast.error('Please enter a valid email address')
    }

    // console.log(details)

    let res = await axios.post(url+'/user/create',details)

    let data = res.data
    // console.log(res)
    //  console.log(data)
     if(res.status ==200 || res.status ==201){
       toast.success(data.msg)
       navigate('/login')
     }
   } catch (error) {
     toast.error(error.response.data.msg)
    //  toast.error(error)
    //  console.log(error)
   }
     
  }


  return (
    <>
      <div className=" h-[90.6vh] bg-[url(bg-image.jpg)] lg:flex-row flex-col bg-center bg-cover bg-blue-300 flex justify-center items-center gap-5 ">
        <h1 className='text-2xl slogan text-white font-semibold max-w-[500px]'>Connect with friends and the world around you Share moments. Build memories. Stay connected</h1>
        <form className="formSignup bg-white mt-5  p-6 border-white border-2  shadow-lg  ">
          <div className="text-center  mb-4 flex flex-col items-center  gap-1">
          <img src="/logo-black.png" alt="" className='w-35 mr-6' />
            <h1 className="text-2xl font-bold">Sign up</h1>
          </div>
          <div>
            <label htmlFor="">User Name</label>
            <input onChange={handleChanger} name='name' type="text" placeholder="User Name" className="w-full mt-1 mb-2 p-3 border rounded-xl" />
          </div>
          <div>
            <label htmlFor="">Email</label>
            <input onChange={handleChanger} name='email' type="email" placeholder="Email" className="w-full mt-1 mb-2 p-3 border rounded-xl" />
          </div>

          <div>
            <label htmlFor="">Password</label>

            <div className="relative">
              <input onChange={handleChanger} name='password' type={showPassword ? "text" : "password"} placeholder="Set Password" className="w-full mt-1 mb-2 p-3 border rounded-xl pr-10" />
              <button type="button" className="absolute right-3 top-5 text-gray-500" onClick={() => setShowPassword(!showPassword)}              >
                {showPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
              </button>
            </div>
          </div>
          <div>

            <label htmlFor="">Confirm Password</label>
            <div className="relative">
              <input onChange={handleChanger} name='cpassword' type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className="w-full mt-1 mb-2 p-3 border rounded-xl pr-10" />
              <button type="button" className="absolute right-3 top-5 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}              >
                {showConfirmPassword ? <IoMdEye size={20} /> : <IoMdEyeOff size={20} />}
              </button>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full cursor-pointer bg-blue-500 mt-5 text-white py-3 rounded-xl font-semibold">Signup</button>
          <p className="text-sm mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-medium">Login</Link>
          </p>
        </form>

      </div>
    </>
  )
}

export default Signup