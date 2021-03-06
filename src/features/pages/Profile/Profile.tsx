import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
// material UI
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { AppDispatch } from '../../../app/store';
import {
  fetchAsyncGetProfile,
    fetchAsyncGetFollowings,
    fetchAsyncGetFollowers,
    fetchAsyncFollowUnFollow,
    // selectMyUser,    
    selectMyProfile,
    selectProfile,
    selectProfiles,
    setOpenProfile,
    setOpenProfiles,
    setProfilesTitleFollowings,
    setProfilesTitleFollowers,
    fetchAsyncRefreshToken,
} from "../Auth/authSlice";
import { 
    fetchAsyncGetUserPosts,
    fetchAsyncGetLikedPosts,
    selectPosts, 
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import EditProfile from "../../components/profile/EditProfile";
import GetMorePost from '../../components/post/GetMorePost';
import styles from './Profile.module.css'

const Profile: React.FC = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();
    // const user = useSelector(selectMyUser);
    const myProfile = useSelector(selectMyProfile);
    const profile = useSelector(selectProfile);
    const profiles = useSelector(selectProfiles);
    const posts = useSelector(selectPosts);

    const handlerFollowed = async () => {
        const result = await dispatch(fetchAsyncFollowUnFollow(profile?.user.id)); 
        if (fetchAsyncFollowUnFollow.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken())
          const retryResult = await dispatch(fetchAsyncFollowUnFollow(profile?.user.id)); 
        }
    };

    useEffect(() => {
      const func = async () => {
          const result = await dispatch(fetchAsyncGetProfile(id));
          if (fetchAsyncGetProfile.rejected.match(result)) {
            await dispatch(fetchAsyncRefreshToken())
            const retryResult = await dispatch(fetchAsyncGetProfile(id));
            if(fetchAsyncGetProfile.fulfilled.match(retryResult)){
              await dispatch(fetchAsyncGetUserPosts(id));
              handleIsUserPosts();
            }
          }else if(fetchAsyncGetProfile.fulfilled.match(result)){
            await dispatch(fetchAsyncGetUserPosts(id));
            handleIsUserPosts();
          }
          // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;

        };
        func();
    }, [dispatch, id])

    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    const [isUserPosts, setIsUserPosts] = useState<boolean>(true);
    const handleIsUserPosts = () => {
        setIsUserPosts(true);
    }
    const handleIsFavoritePosts = () => {
        setIsUserPosts(false);
    }

    const getFavoritePosts = async () => {
      const result = await dispatch(fetchAsyncGetLikedPosts(id));
      handleIsFavoritePosts();
      if (fetchAsyncGetLikedPosts.rejected.match(result)) {
        await dispatch(fetchAsyncRefreshToken())
        const retryResult = await dispatch(fetchAsyncGetLikedPosts(id));
        if (fetchAsyncGetLikedPosts.rejected.match(retryResult)) {
          navigate("/auth/login")
        }
      }

    };
    const getUserPosts = async () => {
      const result = await dispatch(fetchAsyncGetUserPosts(id))
      handleIsUserPosts();
      if (fetchAsyncGetUserPosts.rejected.match(result)) {
        await dispatch(fetchAsyncRefreshToken())
        const retryResult = await dispatch(fetchAsyncGetUserPosts(id));
        if (fetchAsyncGetUserPosts.rejected.match(retryResult)) {
          navigate("/auth/login")
        }
      }
    };

    if(!profile?.id){
      return null
    }

    return (
        <div className={styles.profile}>
          {/* ????????????????????????????????? */}
          <div className={styles.profile_header}>
            {/* <div> */}
              {
                profile?.img
                ? 
                  <Avatar alt="who?" src={profile.img} sx={{ width: 70, height: 70, border: 0.5, borderColor: 'black'}}/>
                :
                  <Avatar  sx={{ width: 70, height: 70, border: 0.5, borderColor: 'black'}} /> 
                  // <Avatar></Avatar>
              }
              
                {/* <Avatar>{profile.nick_name.slice(0, 1)}</Avatar> */}
            {/* </div> */}
            <div className={styles.nick_name}>
                {profile?.nickName}
                <div className={styles.user_name}>@{profile?.user.username}</div>
            </div>
            {profile.id===myProfile.id && 
              <IconButton
                    aria-label="to settings"
                    onClick={() => 
                        navigate(`/settings/`)
                    }

                >
                    <SettingsOutlinedIcon sx={{color: 'white'}}/>
                </IconButton>
              // <SettingsOutlinedIcon 
              //   sx={{width: 25, height: 25, color: 'white'}}
              //   onClick={() => 
              //     navigate(`/settings/`)
              //   }
              // />
            }


          </div>
          
          <>
            {profile.id!==myProfile.id ? (
              <div className={styles.follow_button}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      icon={<PersonOutlineIcon />}
                      checkedIcon={<PersonIcon />}
                      checked={profile.isFollowed}
                      // checked={ profile.followers.some((follow) => follow === user.id)}
                      onChange={handlerFollowed}
                      name="checked" 
                    />
                  }
                  label = {profile.isFollowed ? "?????????????????????" : "??????????????????"}
                />       
              </div>
            ):(
              <>
                <div
                  className={styles.edit_profile}
                  onClick={() => {
                    dispatch(setOpenProfile());
                  }}
                >
                  ???????????????????????????
                </div>
              </>
            )}
          </>
          
          {/* ???????????????????????????????????? */}
          <div className={styles.follow}>
            <span 
              className={styles.following}
              onClick={async() => {
                  if(profile.countFollowing>0){
                    await dispatch(fetchAsyncGetFollowings(profile?.user.id));
                    dispatch(setOpenProfiles());
                    dispatch(setProfilesTitleFollowings());
                  }
              }}
            >
              {Number(profile.countFollowing).toLocaleString()} ????????????
            </span>

            <span 
              className={styles.follower}
              onClick={async() => {
                if(profile.countFollower>0){
                    const result = await dispatch(fetchAsyncGetFollowers(profile.id))
                //   await dispatch(fetchAsyncGetFollowers(profile.id));
                    dispatch(setOpenProfiles());
                    dispatch(setProfilesTitleFollowers());
                }
              }}
            >
               {Number(profile.countFollower).toLocaleString()} ???????????????
            </span>
          </div>
          <hr/>

          {/* ????????????????????? */}
          <div className={styles.navigation}>
            <div
              className={isUserPosts ? `${styles.user_posts} ${styles.is_user_post}` : styles.user_posts}
              onClick={getUserPosts}
            >
              ??????
            </div>
            <div
              className={!isUserPosts ? `${styles.favorite_posts} ${styles.is_user_post}`: styles.favorite_posts}
              onClick={getFavoritePosts}
            >
              ???????????????
            </div>
            <div
              className={styles.to_roadmap}
              onClick={() => { navigate(`/roadmap/user/${profile?.user.id}`); }}
            >
              ??????
            </div>
          </div>

          {/* ???????????? */}
          <div className={styles.posts}>
            {
                posts?.map((post, index) => ( 
                    <div key={index} >
                        <Post post={post} />
                    </div>
                ))
            }
            <GetMorePost />
          </div>

          <EditProfile />
        </div>
    )
}

export default Profile