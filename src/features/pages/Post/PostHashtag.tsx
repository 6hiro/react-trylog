import React,  { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import { 
  fetchAsyncGetHashtagPosts,
  selectPosts, 
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';
import styles from './PostList.module.css';

const PostHashtag: React.FC = () => {
  const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();
    const posts = useSelector(selectPosts);
    
    useEffect(()=>{
      const func = async () => {
        const result = await dispatch(fetchAsyncGetHashtagPosts(id));
      }
      func();
    }, [dispatch, id])

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

export default PostHashtag;