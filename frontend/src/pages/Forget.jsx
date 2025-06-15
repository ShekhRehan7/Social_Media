import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Forget = () => {

   let url = import.meta.env.VITE_DEPLOYMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:9000"
  let emailRef= useRef()


  const handleSubmit = async(e)=>{
    e.preventDefault()
    let obj = {
      email:emailRef.current.value
    }

    try {
      let res = await axios.post(url+'/user/forgetPassword',obj)
      // console.log(res)
      toast.success(res.data.msg)
      
    } catch (error) {
      // console.log(error.response.data.msg)
      toast.error(error.response.data.msg)
      
    }

  }
  return (
    <>
    <div className="h-[90.6vh]  bg-[url(bg-image.jpg)] bg-center bg-cover bg-blue-300 flex justify-center items-center gap-5 ">
      <form className="bg-white p-6 rounded-2xl shadow-lg lg:w-[22%]   ">
        <div className="text-center mb-6 flex flex-col items-center  gap-2">
          <img src="/logo-black.png" alt="" className='w-35 mr-6' />
          <h2 className="text-2xl font-bold">Forget Password</h2>
        </div>
        <input ref={emailRef}  name='email' type="email" placeholder="Find Email" className="w-full mb-2  p-3 border rounded-xl" />    
        <button onClick={handleSubmit} className="w-full cursor-pointer bg-blue-500 text-white py-3 rounded-xl font-semibold">Find your account</button>
        
        <div className="my-4 text-center text-blue-500">
          <Link to={'/login'}>Back To Login</Link>
        </div>
        <p className="text-sm mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 font-medium">Sign Up</Link>
          </p>

      </form>
    </div>
    </>
  )
}

export default Forget