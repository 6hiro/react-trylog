import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { pink } from '@mui/material/colors';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import IconButton from '@mui/material/IconButton';

import { AppDispatch } from '../../../app/store';
import {
    fetchAsyncGetLikesUser,
    // selectMyUser,
    selectMyProfile,
    setProfilesTitleLikes,
    setOpenProfiles,
    fetchAsyncRefreshToken
} from '../../pages/Auth/authSlice' 
import { 
    fetchAsyncLikeUnlikePost,
    fetchAsyncSharePost,
    fetchAsyncUnsharePost,
    fetchPostDelete,
    fetchPostShare,
    fetchPostUnshare
} from '../../pages/Post/postSlice';
import styles from "./Post.module.css";

const Post: React.FC<{
    post: {
        id: string;
        post: string;
        postedBy: {id: string; username: string;};
        profile: {nickName: string; img: string;};
        createdAt: string;
        // updatedAt: string;
        isShared: boolean;
        isLiked: boolean;
        countLikes: number;
        countComments: number;
        tags: {
            id: string;
            name: string;
        }[];
        parent: {
            id: string;
            post: string;
            postedBy: {id: string; username: string;};
            profile: {nickName: string; img: string;};
            createdAt: string;
            // updatedAt: string;
            isShared: boolean;
            isLiked: boolean;
            countLikes: number;
            countComments: number;
            tags: {
                id: string;
                name: string;
            }[];
        };
    }
}> = (props) => {
    const dispatch: AppDispatch = useDispatch();

    let navigate = useNavigate();

    // const post = props.post;
    const isShared = props.post.isShared
    const post = isShared ? props.post.parent : props.post
    const myProfile = useSelector(selectMyProfile);

    // 文章内のハッシュタグやURLからリンク先に飛べるようにする
    const postEdit =(post:string, tags:{ id: string; name: string; }[]) => {      
        const tagIdList = tags.map((tag) =>tag.id)
        // タグの前に「#」を付ける
        const tagNameList = tags.map((tag)=> `#${tag.name}`)
    
        // 改行、半角スペース、全角スペースをを「特殊文字の名前と同じ文字列」に変更
        let postText = post
            .replaceAll(/\r?\n/g, '&nbsp;')
            .replaceAll(' ', '&ensp;')
            .replaceAll('　', '&emsp;')
        // 改行、半角スペース、または、全角スペースの「特殊文字の名前と同じ文字列」でテキストを分割し、リスト化する。
        let postList = postText.split(/(&nbsp;|&ensp;|&emsp;)/g)
        
        // 表示するテキストを生成
        const post_after: JSX.Element = <div>
            {postList.map((value, index) => {
            if( tagNameList.indexOf(value)!==-1 ){
                // ハッシュタグがついている要素
                const tagId = tagIdList[tagNameList.indexOf(value)]
                return <span 
                            key={index} 
                            className={styles.post_hashtag}
                            onClick={() => { navigate(`/post/hashtag/${tagId}`); }}
                        >
                            {value}
                        </span>
            }else if(value==='&nbsp;'){
                // 改行の要素
                return <br key={index}/>
            }else if(value==='&ensp;'){
                // 半角スペースの要素
                return <span key={index}>&ensp;</span>
            }else if(value==='&emsp;'){
                // 全角スペースの要素
                return <span key={index}>&emsp;</span>
            }else if(value.slice(0, 8)==='https://' || value.slice(0, 7)==='http://'){
                if(value.slice(0, 32)==='https://www.youtube.com/watch?v='){
                  if(value.indexOf('&')!==-1){
                    value=value.split('&')[0]
                  }
                  return <iframe 
                          id="inline-frame" 
                          width="320" height="180" 
                          title="YouTube video player" 
                          frameBorder="0"
                          // src={value}
                          src={`https://www.youtube.com/embed/${value.slice(32)}`}
                          allowFullScreen
                          key={index}
                        ></iframe>
                }else if(value.slice(0, 30)==='https://m.youtube.com/watch?v='){
                  if(value.indexOf('&')!==-1){
                    value=value.split('&')[0]
                  }
                  return <iframe 
                          id="inline-frame" 
                          width="320" height="180" 
                          title="YouTube video player" 
                          frameBorder="0"
                          // src={value}
                          src={`https://www.youtube.com/embed/${value.slice(30)}`}
                          allowFullScreen
                          key={index}
                        ></iframe>
                }else if(value.slice(0, 17)==='https://youtu.be/'){
                  if(value.indexOf('&')!==-1){
                    value=value.split('&')[0]
                  }
                  return <iframe 
                          id="inline-frame" 
                          width="320" height="180" 
                          title="YouTube video player" 
                          frameBorder="0"
                          // src={value}
                          src={`https://www.youtube.com/embed/${value.slice(17)}`}
                          allowFullScreen
                          key={index}
                        ></iframe>
                }else{
                    return <a href={value} key={index}>{value}</a>
                }
            }else{
                return <span key={index}>{value}</span>
                // return null
            }
            }
            )}
        </div>
        return post_after
        }

    return (
        <div className={styles.post_container}>
            {isShared && 
                <div className={styles.post_shared_by}>
                    <Link 
                        style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bolder'}} 
                        to={`/prof/${props.post.postedBy.id}/`}
                    > 
                        {props.post.profile.nickName}さん
                    </Link>がシェア
                    <hr />
                </div>
            }
            <div className={styles.post}>
                <div className={styles.post_icon}>
                    <Link 
                        style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                        to={`/prof/${post.postedBy.id}/`}
                    > 
                        <div>
                            {/* <Avatar>{post.postedBy.name.slice(0, 1)}</Avatar> */}
                            {/* <Avatar alt="who?" src={post.profile.img} /> */}
                            {
                                post.profile?.img
                                ? 
                                <Avatar alt="who?" src={post.profile.img}/>
                                :
                                <Avatar /> 
                                // <Avatar></Avatar>
                            }
                        </div>
                    </Link>
                </div>
                <div className={styles.post_main}>
                    <div className={styles.post_main_header}>
                        <Link 
                            style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                            to={`/prof/${post.postedBy.id}/`}
                        > 
                            <div className={styles.post_nick_name}>
                                {post.profile.nickName}
                                <div className={styles.post_user_name}>@{post.postedBy.username}</div>
                            </div>
                        </Link>
                    
                        <div className={styles.posted_at}>
                            {post.createdAt}
                        </div>
                    </div>

                    <div className={styles.post_text}>
                        {postEdit(post.post, post.tags)}
                    </div>        

                    <div className={styles.post_additional_elements}>
                        <div>
                            <IconButton
                                aria-label="to comment list"
                                onClick={() => 
                                    navigate(`/post/${post.id}/`)
                                }

                            >
                                <ChatBubbleOutlineIcon fontSize="small"/>
                            </IconButton>
                            <span
                                className={styles.post_likes}
                                onClick={() =>{
                                    navigate(`/post/${post.id}/`)
                                }} 
                            >
                                {post.countComments}
                            </span>
                        </div>
                        <div>
                            {(props.post.isShared && props.post.postedBy.id === myProfile.user.id) ?
                                <IconButton
                                    aria-label="unshare-button"
                                    onClick={async() => {
                                        // navigate(`/post/${post.id}/`)
                                        const result = await dispatch(fetchAsyncUnsharePost(props.post.id));
                                        if(fetchAsyncUnsharePost.rejected.match(result)){
                                            await dispatch(fetchAsyncRefreshToken());
                                            const restryReult = await dispatch(fetchAsyncUnsharePost(props.post.id));
                                            if(fetchAsyncUnsharePost.rejected.match(restryReult)){
                                                navigate("/auth/login");
                                            }else if(fetchAsyncUnsharePost.fulfilled.match(restryReult)){
                                                dispatch(fetchPostUnshare(props.post.id));
                                            }
                                        }else if(fetchAsyncUnsharePost.fulfilled.match(result)){
                                            dispatch(fetchPostUnshare(props.post.id));
                                        }
                                    }}
                                >
                                    <AutorenewIcon fontSize="small" sx={{ color: pink[500] }}/>
                                </IconButton>
                             :
                                <IconButton
                                    aria-label="share-button"
                                    onClick={async() => {
                                        const result = await dispatch(fetchAsyncSharePost(post.id));
                                        if(fetchAsyncSharePost.rejected.match(result)){
                                            await dispatch(fetchAsyncRefreshToken());
                                            const retryResult = await dispatch(fetchAsyncSharePost(post.id));
                                            if(fetchAsyncSharePost.rejected.match(retryResult)){
                                                navigate("/auth/login");
                                            }
                                        }
                                        // navigate(`/prof/${myProfile.user.id}/`)
                                        // dispatch(fetchPostShare(props.post.id));
                                    }}
                                >
                                    <AutorenewIcon fontSize="small"/>
                                </IconButton>                             
                            }

                            {/* <span
                                className={styles.post_likes}
                                onClick={() =>{
                                    // navigate(`/post/${post.id}/`)
                                    dispatch(fetchAsyncSharePost(post.id));
                                }} 
                            >
                                {post.countComments}
                            </span> */}
                        </div>
                        <div>
                            <Checkbox
                                icon={<FavoriteBorder fontSize="small"/>}
                                checkedIcon={<Favorite fontSize="small" sx={{ color: pink[500] }} />}
                                checked={post.isLiked}
                                onChange={async()=>{
                                    const result = await dispatch(fetchAsyncLikeUnlikePost(post.id));
                                    if(fetchAsyncLikeUnlikePost.rejected.match(result)){
                                        await dispatch(fetchAsyncRefreshToken());
                                        const result = await dispatch(fetchAsyncLikeUnlikePost(post.id));
                                        if(fetchAsyncLikeUnlikePost.rejected.match(result)){
                                            navigate("/auth/login");
                                        }
                                    }

                                }}
                            />
                            <span
                                className={styles.post_likes}
                                onClick={async() =>{
                                    if(post.countLikes>0){
                                        const result = await dispatch(fetchAsyncGetLikesUser(post.id));
                                        if(fetchAsyncGetLikesUser.rejected.match(result)){
                                            await dispatch(fetchAsyncRefreshToken());
                                            const restryResult = await dispatch(fetchAsyncGetLikesUser(post.id));
                                            if(fetchAsyncGetLikesUser.rejected.match(restryResult)){
                                                navigate("/auth/login");
                                            }else if(fetchAsyncGetLikesUser.fulfilled.match(restryResult)){
                                                dispatch(setOpenProfiles());
                                                dispatch(setProfilesTitleLikes());
                                            }
                                        }else if(fetchAsyncGetLikesUser.fulfilled.match(result)){
                                            dispatch(setOpenProfiles());
                                            dispatch(setProfilesTitleLikes());
                                        }
                                    }
                                }} 
                            >
                                {post.countLikes}
                            </span>
                        </div>
                    </div>
                </div>            
            </div>
        </div>
    )
    
    return <div></div>
}

export default Post