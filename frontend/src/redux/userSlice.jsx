
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
let userData = JSON.parse(localStorage.getItem('Social-App'))
const initialState = {
  login: userData ? true : false,
  user: userData ? userData.user : '',
  token: userData ? userData.token : ''
}


export const fetchUserByToken = createAsyncThunk(
  'users/fetchByIdStatus',
  async (token) => {
    // console.log("i am running")
    // console.log("token")
    try {
      const response = await axios.get('http://localhost:9000/user/loggedInUser', {
        headers: {
          'Authorization': token
        }
      });

      // console.log(response.data)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Fetch failed');
    }
  },
)


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setState: (state, action) => {
      // console.log(action.payload)
      localStorage.setItem('Social-App', JSON.stringify(action.payload))
      state.login = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

    },
    logout: (state, account) => {
      localStorage.removeItem('Social-App')
      state.login = false;
      state.user = '';
      state.token = '';
    },
    updateProfile: (state, action) => {
      const updatedFields = action.payload;
      // console.log(updatedFields)

      // Update user object in state
      state.user = {
        ...state.user,
        ...updatedFields,
      };

      // Update localStorage
      const updatedUserData = {
        user: state.user,
        token: state.token,
      };
      localStorage.setItem("Social-App", JSON.stringify(updatedUserData));
    },
    updatePic: (state, action) => {
      let { name, url } = action.payload;
      let copyObj = { ...userData };
      let user = { ...copyObj.user, [name]: url };
      copyObj.user = user;
      localStorage.setItem('Social-App', JSON.stringify(copyObj));
      state.user[name] = url;


    },
    updateFollowings: (state, action) => {
      const friendId = action.payload;
      const index = state.user.followings.indexOf(friendId);

      if (index > -1) {
        // If already followed → Unfollow
        state.user.followings.splice(index, 1);
      } else {
        // If not followed → Follow
        state.user.followings.push(friendId);
      }

      // Sync to localStorage
      const updatedUserData = {
        user: state.user,
        token: state.token,
      };
      localStorage.setItem('Social-App', JSON.stringify(updatedUserData));
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserByToken.fulfilled, (state, action) => {
      // Add user to the state array
      // console.log(action.payload)
      state.user = action.payload.user
    })
  },
})

// Action creators are generated for each case reducer function
export const { setState, logout, updatePic, updateProfile,updateFollowings } = userSlice.actions

export default userSlice.reducer