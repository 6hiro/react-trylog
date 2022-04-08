import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// material UI
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { AppDispatch } from '../../../app/store';
import {
//   selectMyUser,
  selectMyProfile
} from '../Auth/authSlice';
import { 
  fetchAsyncGetPost,    
  fetchAsyncDeletePost,
  fetchAsyncGetComments,
  fetchAsyncPostComment, 
  fetchAsyncDeleteComment,
  fetchCommentDelete,
  fetchPostStart,
  fetchPostEnd,
  selectPost, 
  selectComments,
  setOpenPost
} from '../Post/postSlice';
import Post from '../../components/post/Post';
import UpdatePost from "../../components/post/UpdatePost";
import styles from "./PostDetail.module.css";

const PostDetail = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();
  
  const myProfile = useSelector(selectMyProfile);
  const post = useSelector(selectPost);
  const comments = useSelector(selectComments);

  // 追加するコメント
  const [comment, setComment] = useState("");
  // コメント入力の処理
  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { comment: comment, post: id };
    
    dispatch(fetchPostStart());
    const result = await dispatch(fetchAsyncPostComment(packet));
    dispatch(fetchPostEnd());
    setComment("");
  };

  // 投稿削除の画面の表示
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setDeleteOpen(true);
  };
  const handleClose = () => {
    setDeleteOpen(false);
  };
  // 投稿削除の処理
  const PostDelete = async() => {
    dispatch(fetchAsyncDeletePost(id))
    // const res = await axios.delete(`/post/${id}`)
    navigate("/post/list")
  }

  // 投稿更新の画面の表示
//   const OpenUpdatePostModal = () => {
//     dispatch(setOpenPost())
//   }
  // 投稿更新の処理
  const deleteComment = async(commentId :string) =>{
    const result = await dispatch(fetchAsyncDeleteComment(commentId));
    dispatch(fetchCommentDelete(commentId));
  }
  // useEffect(()=>{
  //   const func = async () => {
  //     const result = await dispatch(fetchAsyncGetPost(id));
  //   };
  //   func();
  // }, [dispatch])
  useEffect(() => {
    const func = async () => {
      const result = await dispatch(fetchAsyncGetPost(id));
      dispatch(fetchAsyncGetComments(id));
    //   console.log(id)
    }
    func();

  }, [dispatch, id])
  return (
    <div className={styles.post_detail_container}>
      {/* 投稿の更新・削除のアイコンボタン */}
      {myProfile.user.id === post.postedBy.id && 
        <div className={styles.delete_update_button}>
          <IconButton 
            aria-label="delete"
            onClick={handleClickOpen}
          >
            <DeleteIcon />
          </IconButton>
          {/* {post.is_public===true ?
            <IconButton 
                aria-label="update" 
                // color="primary"
                onClick={() => OpenUpdatePostModal()}
            >
                <LockOpenIcon fontSize="small" />
            </IconButton>                            
          :
            <IconButton 
              aria-label="update" 
              // color="primary"
              onClick={() => OpenUpdatePostModal()}
            >
              <LockIcon fontSize="small" />
            </IconButton>
          } */}
        </div>
      }

      {/* 投稿内容 */}
      <Post post={post} />
      
      {/* コメントフォーム */}
      <form className={styles.comment_form}>
          <textarea 
              // type="text"
              rows={8}
              cols={45}
              minLength={1}
              maxLength={250}
              className={styles.comment__input}
              placeholder="素敵なコメント(250文字以内)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
          />
          <div
            className={styles.comment_button_style}
          >
            <button
                disabled={!comment.length}
                type="submit"
                className={styles.comment_button}
                onClick={postComment}
            >
                送信
            </button>
          </div>
      </form>
      <br />
      
      {/* コメント一覧 */}
      {comments[0] && 
        <div className={styles.comments}>
          {comments.map((comment, index) => (
            <div  key={index} className={styles.comment}>
              <div className={styles.comment_icon}>
                <Link 
                  style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                  to={`/prof/${comment.commentedBy.id}/`}
                > 
                  <div>
                    {/* <Avatar>{comment.commentedBy.username.slice(0, 1)}</Avatar> */}
                    {/* <Avatar src={ comment.img }/> */}
                    <Avatar alt="who?" src={comment.profile.img} />
                  </div>
                </Link>
              </div>
              <div className={styles.comment_main}>
                <div className={styles.comment_main_header}>
                  <Link 
                    style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
                    to={`/prof/${comment.commentedBy.id}/`}
                  > 
                    <div className={styles.comment_nick_name}>
                        {comment.profile.nickName}
                        <div className={styles.comment_user_name}>@{comment.commentedBy.username}</div>

                    </div>
                  </Link>
                  <div className={styles.commented_at}>
                    {comment.commentedAt}
                  </div>
                </div>

                <div className={styles.comment_text}>
                    {comment.comment}
                </div>


                {comment.commentedBy.id === myProfile.user.id &&
                  <div className={styles.delete_comment} onClick={() => deleteComment(comment.id)}>削除</div>
                }
              </div>
            </div>
          ))}
        </div>
      }
      
      {/* 投稿削除の確認画面 */}
      <Dialog
        open={deleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {post.post.slice(0, 10)}…  を削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={PostDelete} 
            variant="outlined"
            color="primary"
          >
            はい
          </Button>
          <Button 
            onClick={handleClose}
            variant="outlined"
            color="primary" 
            autoFocus
          >
            いいえ
          </Button>
        </DialogActions>
      </Dialog>
      {/* 投稿の編集モーダル */}
      {/* <UpdatePost postId={post.id} isPublic={post.is_public} /> */}

    </div>
  )
}

export default PostDetail