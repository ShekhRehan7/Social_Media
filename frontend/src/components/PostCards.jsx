import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment, FaComment } from "react-icons/fa";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { format } from "timeago.js";
import axios from "axios";
import { useSelector } from "react-redux";
import { RiCloseCircleFill } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const PostCards = (props) => {
  const ele = props.ele;
  const userSlice = useSelector((state) => state.user);

  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentValue, setcommentValue] = useState('');
  const [viewDelete, setViewDelete] = useState(false);

  const likeOrDislike = async () => {
    try {
      let res = await axios.put(
        `http://localhost:9000/post/likes/${ele._id}`,
        {},
        {
          headers: {
            Authorization: userSlice.token,
          },
        }
      );

      if (res.status === 200) {
        props.getAllPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentPost = async () => {
    let obj = { text: commentValue };
    let res = await axios.put(`http://localhost:9000/post/comment/${ele._id}`, obj, {
      headers: {
        'Authorization': userSlice.token
      }
    });

    if (res.status === 200) {
      props.getAllPosts();
      setcommentValue('');
    }
  };

  const deletePost = async (id) => {
    let postId = id._id;
    let res = await axios.delete(`http://localhost:9000/post/deletePost/${postId}`, {
      headers: {
        Authorization: userSlice.token,
      },
    });
    let data = res.data;
    if (res.status === 200) {
      toast.success(data.msg);
      props.getAllPosts();
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: (dots) => (
      <div className="custom-dots">
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-2 h-2 mt-4 bg-gray-400 rounded-full transition-all duration-300"></div>
    ),
  };

  const hasPhotos = ele.files && ele.files.length > 0;
  const commentChanger = (e) => setcommentValue(e.target.value);

  return (
    <div className="relative bg-white h-[600px] rounded-xl shadow-md p-4 mb-4">
      {/* Options */}
      <div className="flex gap-3 items-center absolute right-2 top-6">
        <HiOutlineDotsHorizontal onClick={() => setViewDelete(!viewDelete)} size={18} />
        <IoClose size={18} />
      </div>

      {viewDelete && userSlice.user._id === ele.userId._id && (
        <div className="absolute right-15">
          <button className="bg-red-500 px-3 rounded-md py-1 text-white" onClick={() => deletePost(ele)}>Delete</button>
        </div>
      )}

      {/* User Info */}
      <div className="flex items-center justify-between gap-3 mb-2 py-1">
        <div className="flex items-center gap-3">
          <img
            src={ele.userId.profilePic}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-amber-500"
          />
          <div>
            <Link
              to={userSlice.user._id === ele.userId._id ? '/profile' : '/friendProfile'}
              state={ele.userId._id}
              className="font-semibold text-sm"
            >
              {ele.userId.name}
            </Link>
            <div className="text-xs text-gray-500">{format(ele.createdAt)}</div>
          </div>
        </div>
      </div>

      <p className="ml-2 capitalize px-2 py-1">{ele.title}</p>

      {/* Media (Image/Video) */}
      {hasPhotos ? (
        <div className="rounded-lg">
          <Slider {...settings}>
            {ele.files.map((file, index) => {
              const isVideo = file.endsWith(".mp4") || file.endsWith(".webm") || file.endsWith(".ogg");
              return (
                <div key={index} className="flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={file}
                      controls
                      className="w-full h-[400px] object-cover rounded"
                    />
                  ) : (
                    <img
                      src={file}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-96 object-cover rounded"
                    />
                  )}
                </div>
              );
            })}
          </Slider>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg h-94 flex items-center justify-center">
          <p className="text-gray-800">No content available</p>
        </div>
      )}

      {/* Likes & Comments Count */}
      <div className="mt-3 px-2 text-lg flex items-center gap-2">
        <button onClick={() => setShowLikes(!showLikes)} className="text-black flex gap-2 items-center text-md">
          <BiSolidLike className="bg-blue-500 px-1 py-1 rounded-full" color="white" size={20} />
          {ele.likes.length}
        </button>
        <button className="flex items-center gap-2" onClick={() => setShowComments(true)}>
          <FaComment className="bg-gray-200 py-1 px-1 rounded-full" color="black" size={22} />
          {ele.comment.length}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around text-sm text-gray-600 mt-3 border-t pt-2">
        <button onClick={likeOrDislike} className="hover:text-blue-600 flex items-center justify-center gap-2 font-bold px-2 pb-1">
          {ele.likes.some((user) => user._id === userSlice.user._id) ? (
            <BiSolidLike color="blue" size={20} />
          ) : (
            <BiLike size={20} />
          )}
          Like
        </button>
        <button onClick={() => setShowComments(true)} className="hover:text-blue-600 flex items-center justify-center gap-2 font-bold px-2 pb-1">
          <FaRegComment size={20} /> Comment
        </button>
        <button className="hover:text-blue-600 flex items-center justify-center gap-2 font-bold px-2 pb-1">
          <FaRegShareFromSquare size={20} /> Share
        </button>
      </div>

      {/* Likes Modal */}
      {showLikes && (
        <div className="fixed inset-0 bg-[#ffffff8c] flex items-center justify-center z-50">
          <div className="bg-white w-[400px] overflow-y-auto shadow-lg relative p-4 rounded-md">
            <button onClick={() => setShowLikes(false)} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl">
              <RiCloseCircleFill size={25} />
            </button>
            <h3 className="text-lg font-semibold mb-3 mt-8">Liked By</h3>
            <ul className="space-y-3">
              {ele.likes.map((user, index) => (
                <li key={index} className="flex items-center gap-3">
                  <img src={user.profilePic} alt="User" className="w-10 h-10 rounded-full border object-center" />
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-[#ffffff8c] flex items-center justify-center z-50">
          <div className="bg-white w-[400px] max-h-[600px] overflow-y-auto shadow-lg relative p-4 rounded-md">
            <button onClick={() => setShowComments(false)} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl">
              <RiCloseCircleFill size={25} />
            </button>
            <h3 className="text-lg font-semibold mb-3 mt-8">Comments</h3>

            {ele.comment && ele.comment.length > 0 ? (
              <ul className="space-y-3">
                {ele.comment.map((comment, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <img src={comment.userId?.profilePic || 'default.jpg'} alt="User" className="w-10 h-10 rounded-full border object-center" />
                    <div className="w-full">
                      <span className="font-semibold">{comment.userId?.name || 'User'}</span>
                      <p className="text-sm flex relative w-full">
                        {comment.text}
                        {userSlice.user._id === comment.userId._id && (
                          <span className="absolute right-2">
                            <MdDelete color="red" size={18} />
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-gray-500">{format(comment.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm mt-4">No comments yet. Be the first to comment.</p>
            )}

            {/* Comment Input */}
            <div className="flex items-center gap-3 mt-4 border-t pt-3">
              <img src={userSlice.user.profilePic || 'default.jpg'} alt="User" className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="bg-transparent w-full outline-none text-sm"
                  onChange={commentChanger}
                  value={commentValue}
                />
              </div>
              <button className="text-gray-400 hover:text-blue-500" onClick={commentPost}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCards;
