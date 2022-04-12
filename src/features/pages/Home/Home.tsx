import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

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
  let navigate = useNavigate();

  const posts = useSelector(selectPosts);
  const myprofile = useSelector(selectMyProfile);
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetFollowingsPosts(myprofile.user.id));
    }
    func();
  }, [dispatch])

  if(myprofile?.countFollowing){
    return (
      <div className={styles.posts_list_container}>
        フォローしているユーザーが投稿が見れます
      </div>
    )

  }

  if(!posts){
    return null
  }


  return (
    <div className={styles.posts_list_container}>
          <div className={styles.navigation}>
        <div
            className={`${styles.roadmaps}  ${styles.is_user_roadmaps}`}
            onClick={async() => {
              const result = await dispatch(fetchAsyncGetFollowingsPosts(myprofile.user.id));
            }}
        >
         つぶやき
        </div>
        <div
            className={`${styles.user_roadmaps}`}

            onClick={() => {
              navigate(`/roadmap`);
            }}
        >
             計画
        </div>
    </div>
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