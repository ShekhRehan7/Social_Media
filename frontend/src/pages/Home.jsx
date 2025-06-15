import React, { useEffect, useState } from 'react'
import PostUploader from '../components/PostUploader'

import axios from 'axios'
import PostCards from '../components/PostCards'



const Home = () => {

    const [AllPost, setAllPost] = useState([]);

  let getAllPosts = async()=>{
    let res = await axios.get('http://localhost:9000/post/getAllPost');
    let data = res.data;
    // console.log(data)
    setAllPost(data.post)
  }

  useEffect(()=>{
    getAllPosts()
  },[])
  
  return (
    <div className='bg-gray-100 pt-2 px-2 py-2'>
       <PostUploader  getAllPosts={getAllPosts} />
         <div className="flex w-[300px] sm:w-[350px]  md:w-[400px] m-auto flex-col gap-2 mt-5  ">
        {
          AllPost.map((ele,i)=>{
            return <PostCards getAllPosts={getAllPosts} key={ele._id} ele ={ele}/>
          })
        }
      </div>
      
    </div>
  )
}

export default Home