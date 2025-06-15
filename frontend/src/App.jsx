import React from 'react'
import { BrowserRouter , Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import Forget from './pages/Forget';
import UserProfile from './pages/UserProfile';
import FriendProfile from './pages/FriendProfile';
import Chat from './pages/Chat';
import AllUser from './pages/AllUser'
import EditProfile from './pages/EditProfile';
const App = () => {

  let userSlice =useSelector((state)=>state.user)
  // console.log(userSlice)
  let login = userSlice.login
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={login === true ?<Home/> : <Navigate to={'/login'} />} />
      <Route path='/profile' element={login === true ?<UserProfile/> : <Navigate to={'/login'} />} />
      <Route path='/allUser' element={login === true ?<AllUser/> : <Navigate to={'/login'} />} />
      <Route path='/editprofile' element={login === true ?<EditProfile/> : <Navigate to={'/login'} />} />
      <Route path='/friendProfile' element={login === true ?<FriendProfile/> : <Navigate to={'/login'} />} /> 
      <Route path='/chat' element={login === true ?<Chat/> : <Navigate to={'/login'} />} />
      <Route path='/signup' element={ login === false ? <Signup/> : <Navigate to={'/'}/> } />
      <Route path='/login' element={ login === false ?<Login/> :  <Navigate to={'/'}/>} />
      <Route path='/forget' element={ login === false ?<Forget/> : <Navigate to={'/'}/>}/>
    </Routes>
    <ToastContainer/>
    </BrowserRouter>
      
    </>
  )
}

export default App


