import { FaUserFriends, FaVideo, FaStore, FaUsers, FaBell } from 'react-icons/fa';
import { FiSettings, FiHelpCircle, FiMoon, FiFlag, FiLogOut, FiUsers, FiHome, FiLogIn, FiEdit } from 'react-icons/fi';
import { FaUserPlus } from "react-icons/fa6"
import { PiMessengerLogoFill } from 'react-icons/pi';
import { IoIosArrowDown } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useState } from 'react';
import { CgMenuGridR } from "react-icons/cg";
import { MdMenuBook, MdMovie, MdStar } from 'react-icons/md';
import { AiFillCloseCircle } from "react-icons/ai";
import axios from 'axios';
const Navbar = () => {

  let dispatch = useDispatch();
  let userSlice = useSelector((state) => state.user)
  // console.log(userSlice)
  const [showUi, setshowUi] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchedFriends, setsearchedFriends] = useState([]);


  const handleUi = () => {
    setshowUi(!showUi)
  }
  const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleSearch = async(e)=>{
        let val = e.target.value
        // console.log(val)
        let res = await axios.get(`http://localhost:9000/user/searchFriends?name=${val}`,{
          headers:{
            'Authorization':userSlice.token
          }
        })
        let data = res.data;
        // console.log(data)
        setsearchedFriends(data)

    }
  return (
    <div className="relative w-full h-17 lg:bg-white bg-white shadow-md flex items-center justify-between px-2">
      {/* Left Section - Logo & Search */}
      <div className="flex items-center space-x-2">
        <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl">
          <img src="logo-2.png" alt="" className="px-2" />
        </div>
        <div className="  hidden md:bg-gray-100 rounded-full px-3 py-2 md:flex items-center space-x-2">
          <CiSearch className="text-gray-600 text-xl  md:block hidden" />
          <input
           onChange={handleSearch}
            type="text"
            placeholder="Search ReelMates"
            className="bg-transparent outline-none text-sm md:block hidden"
          />
        </div>
      </div>

    {searchedFriends.length > 0 && (
  <div className='hidden md:block absolute top-20 py-2 h-[400px] ml-5 border-2 border-black bg-white overflow-auto w-[300px] rounded-md z-20'>
    {searchedFriends.map((ele) => (
      <Link  to={( userSlice.user._id===ele._id?'/profile':'/friendProfile')}  state={ele._id} onClick={()=>setsearchedFriends([])} key={ele.id} className='flex gap-4 items-center border-b px-2 py-3'>
        <img src={ele.profilePic} className='w-11 h-11 rounded-full border border-black' alt="" />
        <p>{ele.name}</p>
      </Link>
    ))}
  </div>
)}


      {/* Center Section - Icons */}
      <div className="hidden  md:flex items-center md:space-x-12">
        <Link to="/"><FiHome className="text-gray-600 text-2xl" /></Link>
       <Link to={'/allUser'}> <FaUserFriends className="text-gray-600 text-xl" /> </Link>
        <FaVideo className="text-gray-600 text-xl" />
        
      </div>

      {/* Right Section - Menu, Msg, Bell, Profile */}
      <div className=" flex items-center space-x-4">
        <div className="bg-black p-2 rounded-full">
          <CgMenuGridR className="text-white text-lg" onClick={toggleMenu} />
        </div>
        <div className="bg-black text-white p-2 rounded-full">
          <PiMessengerLogoFill className="text-lg" color='white' />
        </div>
        <div className="relative bg-black text-white p-2 rounded-full">
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </div>
        <div className="relative w-9 h-9 rounded-full bg-black">
          <img onClick={handleUi} src={userSlice.user ? userSlice.user.profilePic : 'logo-2.png'} alt="profile" className="w-full h-full rounded-full object-cover cursor-pointer" />
          <IoIosArrowDown size={15} onClick={handleUi} className="text-white absolute -right-1 bg-black rounded-full -bottom-0  cursor-pointer" />
        </div>
      </div>


      {
        menuOpen &&

        
        <div className=" absolute right-2  top-20 flex z-50 flex-col w-[300px] overflow-auto  lg:w-[500px] bg-gray-200 text-gray-800 p-4 rounded-md">
          <div className='flex items-center justify-between'>
            <h1 className=' capitalize font-bold text-xl'>menu</h1>
          <AiFillCloseCircle onClick={toggleMenu} size={30}/>
          </div>

          <div className="md:hidden mt-4 bg-white rounded-full px-3 py-2 flex items-center space-x-2">
          <CiSearch className="text-gray-600 text-xl" />
          <input
           onChange={handleSearch}
            type="text"
            placeholder="Search ReelMates"
            className="bg-transparent outline-none text-sm  "
          />
        </div>
        <div className='bg-white rounded-md mt-2 '>
               {searchedFriends.length > 0 && (
  <div className=' md:hidden  z-20  '>
    {searchedFriends.map((ele) => (
      <Link  to={( userSlice.user._id===ele._id?'/profile':'/friendProfile')}  state={ele._id} onClick={()=>setsearchedFriends([])} key={ele.id} className='flex gap-4 items-center border-b px-2 py-2'>
        <img src={ele.profilePic} className='w-10 h-10 rounded-full border border-black' alt="" />
        <p>{ele.name}</p>
      </Link>
    ))}
  </div>
)}
        </div>


          <div className=' h-full w-full rounded-2xl'>
            <div className='bg-white h-60 rounded-md  '>
              <h1 className=' capitalize mt-2 px-2 py-2 text-xl font-bold'>Create</h1>
              <ul className='flex flex-col gap-3 ml-2 mt-2 py-2'>
                <li className='flex items-center gap-2'><span className='bg-gray-400 rounded-full px-2 py-2'><FiEdit size={18} /></span>Post</li>
                <li className='flex items-center gap-2'><span className='bg-gray-400 rounded-full px-2 py-2'><MdMenuBook size={18} /></span>Story</li>
                <li className='flex items-center gap-2'><span className='bg-gray-400 rounded-full px-2 py-2'><MdMovie size={18} /></span>Reel</li>
                <li className='flex items-center gap-2'><span className='bg-gray-400 rounded-full px-2 py-2'><MdStar size={18}  /></span>Live Event</li>
              </ul>

            </div>
           <div className="bg-white mt-2 rounded-md shadow-md p-3 md:hidden">
  <ul className="flex flex-col gap-4">
    
      <Link to="/" className='flex items-center gap-3'>
        <FiHome className="text-gray-600 text-2xl hover:text-blue-600" />
        <span className='text-lg '>Home</span>
      </Link>
    
    <Link to={'/allUser'} className='flex items-center gap-3'>
      <FaUserFriends className="text-gray-600 text-2xl hover:text-blue-600" />
      <span className='text-lg'>Friend</span>
    </Link>
    <li className='flex items-center gap-3'>
      <FaVideo className="text-gray-600 text-2xl hover:text-blue-600" />
      <span className='text-lg '>Video</span>
    </li>
  </ul>



</div>


          </div>
        </div>
      }

      {/* Dropdown Menu */}
      {showUi &&
        <div className="absolute right-4 top-16 w-80 bg-white rounded-xl shadow-lg p-4 space-y-2 text-sm z-50">
          {/* Profile Header */}
          <Link to={'/profile'} onClick={() => setshowUi(false)} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <img
              src={userSlice.user ? userSlice.user.profilePic : 'logo-2.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full bg-black cursor-pointer object-cover"
            />
            <div>
              <p className="font-medium text-black">{userSlice.user.name}</p>
            </div>
          </Link>

          {/* See All Profiles */}
          <Link to={'/profile'} onClick={() => setshowUi(false)} className="w-full bg-gray-100 hover:bg-gray-200 p-2 rounded-lg flex items-center justify-center text-sm font-medium">
            <FiUsers className="mr-2" /> See profile
          </Link>

          <hr />

          {/* Options */}
          <DropdownItem onClick={() => setshowUi(false)} icon={<FiSettings />} text="Settings & privacy" />
          <DropdownItem onClick={() => setshowUi(false)} icon={<FiHelpCircle />} text="Help & support" />
          <DropdownItem onClick={() => setshowUi(false)} icon={<FiMoon />} text="Display & accessibility" />
          <DropdownItem onClick={() => setshowUi(false)} icon={<FiFlag />} text="Give feedback" />
          {userSlice.login === true && <DropdownItem onClick={() => { dispatch(logout()); setshowUi(false); }} icon={<FiLogOut />} text="Log out" />}
          {userSlice.login === false && <Link to={'/login'}> <DropdownItem onClick={() => setshowUi(false)} icon={<FiLogIn />} text="LogIn" /></Link>}
          {userSlice.login === false && <Link to={'/signup'}> <DropdownItem onClick={() => setshowUi(false)} icon={<FaUserPlus />} text="SignUp" /></Link>}

          {/* Footer */}
          <div className="text-xs text-gray-500 pt-2 px-2">
            Privacy · Terms · Advertising · Ad choices · Cookies <br />
            More · Meta © 2025
          </div>
        </div>}
    </div>
  );
};

// Reusable Dropdown Item Component
const DropdownItem = ({ icon, text, onClick }) => (
  <div onClick={onClick} className="flex justify-between items-center hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
    <div className="flex items-center space-x-3">
      <div className="bg-gray-100 p-2 rounded-full text-gray-700 text-base">
        {icon}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  </div>
);

export default Navbar;
