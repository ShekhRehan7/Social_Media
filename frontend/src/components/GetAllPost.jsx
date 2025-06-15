// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaRegHeart , FaRegComment} from "react-icons/fa";
// import { FiShare2 } from "react-icons/fi";

// const GetAllPost = () => {
//   const [allPost, setAllPost] = useState([]);

//   const datafetch = async () => {
//     try {
//       const res = await axios.get('http://localhost:9000/post/getAllPost');
//       console.log(res);
//       setAllPost(res.data.post);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     datafetch();
//   }, []);


//   function formatPostDate(dateString) {
//     const date = new Date(dateString);
//     const now = new Date();

//     const day = date.getDate();
//     const month = date.toLocaleString('default', { month: 'long' }); // "May"
//     const year = date.getFullYear();

//     if (year === now.getFullYear()) {
//       return `${day} ${month}`; // e.g., "19 May"
//     } else {
//       return `${day} ${month} ${year}`; // e.g., "11 April 2024"
//     }
//   }


//   return (
//     <div className='flex flex-col items-center gap-6 py-6'>
//       {allPost.map((post, i) => (
//         <div
//           key={i}
//           className='w-[400px] bg-white border border-gray-300 rounded-lg shadow-md'
//         >
//           {/* Post Header */}
//           <div className='flex items-center gap-3 px-4 py-3'>
//             <img src={post.userId.profilePic} className='w-10 h-10  rounded-full bg-gray-300 ' alt="" /> 
//             <div className='font-semibold text-sm'>{post.userId.name}</div>
//           </div>

//           {/* Post Image */}
//           <div className='w-full h-[400px] bg-gray-100 overflow-hidden '>
//             <img
//               src={post.files}
//               alt='post'
//               className='w-full h-full object-cover'
//             />
//           </div>
//         {/*Like Comment Share  */}
//         <div className='flex gap-38  mt-2'>
//           <FaRegHeart className='ml-3' size={22} />
//           <FaRegComment size={22}/>
//           <FiShare2 size={22}/>
//         </div>
//           {/* Post Footer */}
//           <div className='px-4 py-2'>
//             <p className='text-sm'>
//               {post.title}
//             </p>
//             <p className='text-xs text-gray-500 mt-1'>
//               {formatPostDate(post.createdAt)}
//             </p>

//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GetAllPost;
