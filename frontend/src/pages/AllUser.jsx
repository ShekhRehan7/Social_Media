import React, { useEffect, useState } from 'react'; 
import FriendCard from '../components/FriendCard';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AllUser = () => {
  let url = import.meta.env.VITE_DEPLOYMENT==="production"?import.meta.env.VITE_ENDPOINT:"http://localhost:9000"

  const { user, token } = useSelector((state) => state.user);
  const [allUser, setAllUser] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(url+'/user/allUser', {
        headers: {
          Authorization: token,
        },
      });

      const data = res.data.user;

      // const filteredUsers = data.filter((u) => 
      //   u._id !== user._id &&
      //   (user.followers || []).includes(u._id) &&
      //   !(user.following || []).includes(u._id)
      // );

      setAllUser(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className='grid  grid-cols-1 place-items-center mt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ml-5 gap-3'>
      {allUser.length > 0 ? (
        allUser.map((ele) => (
          <FriendCard key={ele._id} element={ele} />
        ))
      ) : (
        <p className="text-center mt-10 text-gray-500">No users to show</p>
      )}
    </div>
  );
};

export default AllUser;
