import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import {
    selectMyProfile,
} from '../../pages/Auth/authSlice' 
import { 
  fetchAsyncGetFollowingsPosts, 
  selectPosts, 
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';
import styles from '../Post/PostList.module.css';

const Home: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const profile = useSelector(selectMyProfile);
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetFollowingsPosts(profile.user.id));
    }
    func();
  }, [dispatch])


  return (
    <div className={styles.posts_list_container}>
      <div className={styles.posts}>
        {
          posts
            .map((post, index) => ( 
              <div key={index} >
                <Post post={post} />
              </div>
            ))
        }
      </div>

      <GetMorePost />
    </div>       
  )
  
}

export default Home