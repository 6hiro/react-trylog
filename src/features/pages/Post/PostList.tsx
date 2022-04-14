import React,  { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from 'react-router-dom';

import { AppDispatch } from '../../../app/store';
import { 
  fetchAsyncGetPosts, 
  selectPosts, 
} from './postSlice';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';
import styles from './PostList.module.css';
import { fetchAsyncRefreshToken } from '../Auth/authSlice';

const PostList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector(selectPosts);
  let navigate = useNavigate();
    
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetPosts());
      if(fetchAsyncGetPosts.rejected.match(result)){
        await dispatch(fetchAsyncRefreshToken())
        const retryResult = await dispatch(fetchAsyncGetPosts());
        if(fetchAsyncGetPosts.rejected.match(retryResult)){
          navigate("/auth/login")
        }
      }
    }
    func();
  }, [dispatch])

  if(!posts){
    return null
  }
    return (
      <div className={styles.posts_list_container}>
        <div className={styles.posts}>
          {
            posts?.map((post, index) => ( 
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

export default PostList