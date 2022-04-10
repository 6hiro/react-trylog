import React,  { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import {
  fetchAsyncGetSearchedPosts,
  selectPosts, 
} from '../Post/postSlice';

import Post from '../../components/post/Post';
import GetMorePost from '../../components/post/GetMorePost';

import styles from './PostList.module.css';


const PostSearch: React.FC = () => {
  const { word } = useParams();
  const posts = useSelector(selectPosts);
  let navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  
  useEffect(()=>{
    const func = async () => {
      const result = await dispatch(fetchAsyncGetSearchedPosts(word));
    }
    func();
  }, [dispatch, word])
  if(!posts){
    return null
  }
  return (
    <div className={styles.posts_list_container}>
          {/* <div>{word}の検索結果</div> */}
          <div className={styles.navigation}>
            <div className={ `${styles.roadmaps} ${styles.is_user_roadmaps}`}>
              つぶやき
            </div>
            <div
                className={`${styles.user_roadmaps}`}
                onClick={() => {
                  navigate(`/roadmap/search/${word}/`);
                }}
            >
                計画
            </div>
        </div>
        
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

export default PostSearch;