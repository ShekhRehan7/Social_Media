import React, { useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaFileImage } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";

const PostUploader = (props) => {
  
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef();
  const userSlice = useSelector((state) => state.user);
  // console.log(userSlice)
  const handleFileChange = (e) => {
    const files = [...e.target.files];
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleEmojiClick = (e) => {
    inputRef.current.value += e.emoji;
  };

  const handleRemove = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleSubmit = async () => {
     const text = inputRef.current.value
     if (!text && selectedFiles.length === 0) {
    toast.error("Please fill the fields");
    return;
  }
    
    try {
      
      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDNAME}/upload`,
            formData
          );
          return res.data.secure_url;
        })
      );

      const postPayload = {
        title: inputRef.current.value,
        files: uploadedUrls,
      };

      const res = await axios.post('http://localhost:9000/post/create', postPayload, {
        headers: {
          'Authorization': userSlice.token,
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.msg);
        props.getAllPosts()
        inputRef.current.value = '';
        setSelectedFiles([]);

      }
    } catch (error) {
      toast.error('Post failed. Try again.');
      console.error(error);
    }
  };

  

  return (
    <div className='flex justify-center '>
      <div className=' w-[400px]  sm:w-[500px] bg-white border border-gray-300 rounded-xl p-4 shadow-md relative'>

        {/* Header with input */}
        <div className='flex items-center gap-3 mb-3'>
          <img
            src={userSlice.user.profilePic}
            alt="User"
            className='w-10 h-10 rounded-full object-cover'
          />
          <input
            ref={inputRef}
            placeholder="What's on your mind?"
            className='flex-1 bg-gray-100 px-4 py-2 rounded-full focus:outline-none'
          />
        </div>

        {/* Preview */}
        {selectedFiles.length > 0 && (
          <div className='flex flex-wrap gap-4 mb-4'>
            {selectedFiles.map((file, index) => {
              const isImage = file.type.startsWith('image');
              return (
                <div key={index} className='relative group'>
                  {isImage ? (
                    <img src={URL.createObjectURL(file)} alt="preview" className='w-[200px] h-[200px] object-cover rounded-lg'/>
                  ) : (
                    <video src={URL.createObjectURL(file)} controlsclassName='w-[200px] h-[200px] object-cover rounded-lg' />
                  )}
                  <IoMdClose size={20} className='absolute top-1 right-1 bg-white rounded-full p-1 cursor-pointer group-hover:opacity-100 opacity-80' onClick={() => handleRemove(index)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Controls */}
        <div className='flex justify-between items-center mt-3'>
          <div className='flex gap-4 items-center'>
            <label htmlFor='files' className='flex items-center gap-1 cursor-pointer text-sm text-green-600 font-medium'>
              <FaFileImage size={18} />
              Photo/Video
              <input id='files' type='file' multiple hidden onChange={handleFileChange} />
            </label>

            <div
              onClick={() => setShowEmoji(!showEmoji)}
              className='flex items-center gap-1 cursor-pointer text-sm text-yellow-500 font-medium'
            >
              <MdOutlineEmojiEmotions size={20} />
              Emoji
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition'
          >
            Post
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className='absolute top-full mt-2 z-10'>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostUploader;
