import React,  { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import { 
  fetchAsyncGetHashtagPosts,
  selectPosts, 
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';
import styles from './PostList.module.css';
import { fetchAsyncRefreshToken } from '../Auth/authSlice';

const PostHashtag: React.FC = () => {
  const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const posts = useSelector(selectPosts);
    let navigate = useNavigate();
    
    useEffect(()=>{
      const func = async () => {
        const result = await dispatch(fetchAsyncGetHashtagPosts(id));
        if(fetchAsyncGetHashtagPosts.rejected.match(result)){
          await dispatch(fetchAsyncRefreshToken())
          const retryResult = await dispatch(fetchAsyncGetHashtagPosts(id));
          if(fetchAsyncGetHashtagPosts.rejected.match(retryResult)){
            navigate("/auth/login")
          }
        }
      }
      func();
    }, [dispatch, id])

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

export default PostHashtag;