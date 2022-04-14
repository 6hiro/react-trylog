import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { PROPS_REGISTER, PROPS_AUTHEN, PROPS_FORGOT, PROPS_RESET, PROPS_UPDATE_PROFILE } from "../../types"

const authUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncLogin = createAsyncThunk(
  // actionの名前
  "auth/login",
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post("login/", authen);
    return res.data;
  }
);
export const fetchAsyncLogout = createAsyncThunk(
  "auth/logout",
  async () => {
    const res = await axios.post("logout/", {});
    return res.data;
  }
);
export const fetchAsyncRefreshToken = createAsyncThunk(
  "auth/refreshToken",
  async () => {
    const refreshJWT = `{"refresh": "${localStorage.refreshJWT}"}`
    const res = await axios.post(`refresh/`, refreshJWT);
    return res.data;
  }
);
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_REGISTER) => {
    const res = await axios.post("register/", auth);
    return res.data;
  }
);
export const fetchAsyncForgotPassword = createAsyncThunk(
  "auth/forgot",
  async (auth: PROPS_FORGOT) => {
    const res = await axios.post("forgot/", auth);
    return res.data;
  }
);
export const fetchAsyncResetPassword = createAsyncThunk(
  "auth/reset",
  async (auth: PROPS_RESET) => {
    const res = await axios.post("reset-password/", auth);
    return res.data;
  }
);
export const fetchAsyncGetMyProf = createAsyncThunk("myprofile/get", async () => {
  const res = await axios.get("myprofile/");
  return res.data[0];
});
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/patch",
  async (profile: PROPS_UPDATE_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.patch(`/profile/${profile.id}/`, uploadData);
    return res.data;
  }
);
export const fetchAsyncUpdateAccountName = createAsyncThunk(
  "auth/patch",
  async (user: {name: string, id: string}) =>{
    const res = await axios.patch(`/update-account/${user.id}/`, {username: user.name});
    return res.data;
  }
);
export const fetchAsyncDeleteAccount = createAsyncThunk(
  "commentDelete/delete", 
  async (id: string ) => {
    const  res  = await axios.delete(`delete-account/${id}/`);
    return res.data;
});
export const fetchAsyncGetProfile = createAsyncThunk(
  "auth/profile",
  async (id: string | undefined) => {
    const res = await axios.get(`/profile/${id}/`);
    return res.data;
  }
);

export const fetchAsyncFollowUnFollow = createAsyncThunk(
  "like/post",
  async (userId: string | undefined) => {
    // await axios.get(`/sanctum/csrf-cookie`);
    const res = await axios.put(`/follow/${userId}/`, {});
    return res.data;
  }
);
export const fetchAsyncGetFollowings = createAsyncThunk(
  "followings/get",
  async (userId: string | undefined) =>{
    const res =  await axios.get(`/following/${userId}/`);
    return res.data;
  }
);
export const fetchAsyncGetFollowers = createAsyncThunk(
  "followers/get",
  async (profId: string) =>{
    const res =  await axios.get(`/followers/${profId}/`);
    return res.data;
  }
);
export const fetchAsyncGetLikesUser = createAsyncThunk(
  "likes/get",
  async (postId: string | undefined) =>{
    const res =  await axios.get(`/post/${postId}/likes/`);
    return res.data;
  }
);
export const authSlice = createSlice({
  // action typesで使われる名前 
  name: "auth",
  // Stateの初期状態
  initialState: {
    openUpdateUser: false,
    openUpdateProfile: false,
    openProfiles: false,
    isLoadingAuth: false,
    profilesTitle: "",
    myprofile: {
      id: "",
      nickName: "",
      user: {
        id: "",
        username: ""
      },
      createdAt: "",
      img: "",
      isFollowed: false,
      countFollower: 0,
      countFollowing: 0,
      bio: "",
    },
    profile: {
      id: "",
      nickName: "",
      user: {
        id: "",
        username: ""
      },
      createdAt: "",
      img: "",
      isFollowed: false,
      countFollower: 0,
      countFollowing: 0,
      bio: "",
    },
    profiles: [
      {
        id: "",
        nickName: "",
        user: {
          id: "",
          username: ""
        },
        createdAt: "",
        img: "",
        isFollowed: false,
        countFollower: 0,
        countFollowing: 0,
        bio: "",
      },
    ],
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenUser(state) {
      state.openUpdateUser = true;
    },
    resetOpenUser(state) {
      state.openUpdateUser = false;
    },
    setOpenProfile(state) {
      state.openUpdateProfile = true;
    },
    resetOpenProfile(state) {
      state.openUpdateProfile = false;
    },
    setOpenProfiles(state) {
      state.openProfiles = true;
    },
    resetOpenProfiles(state) {
      state.openProfiles = false;
    },
    setProfilesTitleFollowings(state){
      state.profilesTitle = "フォロー"
    },
    setProfilesTitleFollowers(state){
      state.profilesTitle = "フォロワー"
    },
    setProfilesTitleLikes(state){
      state.profilesTitle = "いいね"
    },
    editProfileName(state, action){
      state.profile.nickName = action.payload;
    },
    editUserName(state, action){
      state.myprofile.user.username = action.payload;
    },
    logOut(state) {
      state.myprofile.id= ""
      state.myprofile.nickName = ""
      state.myprofile.user.id = ""
      state.myprofile.user.username= ""
      state.myprofile.createdAt = ""
      state.myprofile.img = ""
      state.myprofile.isFollowed = false
      state.myprofile.countFollower = 0
      state.myprofile.countFollowing = 0
      state.myprofile.bio = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      // console.log(action.payload.token)
      localStorage.setItem("localJWT", action.payload.tokens.accessToken);
      localStorage.setItem("refreshJWT", action.payload.tokens.refreshToken);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.tokens.accessToken}`;
    });
    builder.addCase(fetchAsyncRefreshToken.fulfilled, (state, action) => {
      localStorage.removeItem("localJWT");
      // localStorage.removeItem("refreshJWT");
      localStorage.setItem("localJWT", action.payload.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      // localStorage.setItem("refreshJWT", action.payload.refresh);
    });
    builder.addCase(fetchAsyncLogout.fulfilled, (state, action) => {
      if(action.payload.message==='success'){
        localStorage.removeItem("localJWT");
        localStorage.removeItem("refreshJWT");
      }
      // localStorage.setItem("localJWT", action.payload.access);
      // localStorage.setItem("refreshJWT", action.payload.refresh);
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.profile = action.payload;
    })
    builder.addCase(fetchAsyncGetProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
    builder.addCase(fetchAsyncGetFollowings.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncGetFollowers.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncFollowUnFollow.fulfilled, (state, action) => {
      if(action.payload.result==='follow'){
        state.profile.countFollower += 1 ;
        state.profile.isFollowed = true;
      }
      else if(action.payload.result==='unfollow'){
        state.profile.countFollower -= 1;
        state.profile.isFollowed = false;
      }
    });
    builder.addCase(fetchAsyncGetLikesUser.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
  },
});

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenUser,
  resetOpenUser,
  setOpenProfile,
  resetOpenProfile,
  setOpenProfiles,
  resetOpenProfiles,
  setProfilesTitleFollowers,
  setProfilesTitleFollowings,
  setProfilesTitleLikes,
  // setUser,
  editUserName,
  editProfileName,
  logOut,
} = authSlice.actions;

export const selectMyProfile = (state: RootState) => state.auth.myprofile;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectProfilesTitle = (state: RootState) => state.auth.profilesTitle;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenUpdateUser= (state: RootState) => state.auth.openUpdateUser;
export const selectOpenUpdateProfile= (state: RootState) => state.auth.openUpdateProfile;
export const selectOpenProfiles= (state: RootState) => state.auth.openProfiles;

export default authSlice.reducer;