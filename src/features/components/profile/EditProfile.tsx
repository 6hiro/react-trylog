import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

import { AppDispatch } from "../../../app/store";
import {
  // selectMyUser,
  selectProfile,
  selectOpenUpdateProfile,
  // editUserName,
  editProfileName,
  resetOpenProfile,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateAccountName,
  fetchAsyncUpdateProf,
} from "../../pages/Auth/authSlice";
import {
  fetchUpdateProf,
} from "../../pages/Post/postSlice"
import styles from './EditProfile.module.css'

const Input = styled('input')({
  display: 'none',
});

const customStyles = {
  overlay: {
    backgroundColor: "rgba(230, 230, 230, 0.6)", 
    // backdropFilter: "blur(5px)",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    width: 300,
    height: 400,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile:React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenUpdateProfile);
  const profile = useSelector(selectProfile);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

  // 投稿のUpdateの処理
  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet =  { 
      nickName: profile.nickName, 
      img: image,
      id: profile.user.id,
    };
    dispatch(fetchCredStart());
    const result = await dispatch(fetchAsyncUpdateProf(packet));
    if(fetchAsyncUpdateProf.fulfilled.match(result)){
        dispatch(fetchCredEnd());
        dispatch(fetchUpdateProf({postedBy: profile.user.id, name: profile.nickName, img: profile.img}));
        dispatch(resetOpenProfile());
    }

  }
  
  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
            dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <div className={styles.edit_prof}>
          <div className={styles.edit_prof_title}>プロフィール編集</div>
        
          <div className={styles.edit_progress}>
            {isLoadingAuth && <CircularProgress />}
          </div>

          <form className={styles.edit_prof_form}>
            <TextField
              id="standard-basic" label="ニックネーム（８文字以内）"
              type="text"
              fullWidth
              inputProps={{maxLength: 8}}
              value={profile?.nickName}
              onChange={(e) => dispatch(editProfileName(e.target.value))}
            />

            {image!==null && 
              <>
                <div
                  className={styles.reset_image}
                  onClick={() => {
                    setImage(null)
                    setPreviewImage(null)
                  }}
                >画像の選択を解除</div>
                <img src={String(previewImage)} alt="prof_img" className={styles.preview_image}/>
              </>
            }
            <input    
              type="file"
              id="imageInput"
              accept="image/*"
              hidden={true}
              onChange={
                (e) => {
                  setImage(e.target.files![0])
                  // プレビュー表示用の処理
                  const reader = new FileReader();
                  reader.onload = () => {
                    if(reader.readyState === 2){
                      setPreviewImage(reader.result)
                    }
                  }
                  reader.readAsDataURL(e.target.files![0])
                }

              }
            />
            <br />

            {/* <IconButton onClick={handlerEditPicture} color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton> */}
            {/* <label htmlFor="icon-button-file"> */}
                {/* <Input accept="image/*" id="icon-button-file" type="file" /> */}
                <IconButton onClick={handlerEditPicture} color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              {/* </label> */}
        
            <div className={styles.edit_prof_button}>
              <Button
                disabled={!profile?.nickName}
                // variant="contained"
                variant="outlined"
                color="primary"
                type="submit"
                onClick={updateProfile}
              >
                プロフィールを変更
              </Button>
            </div>
          </form>        
        </div>
      </Modal>
    </>
  );
};

export default EditProfile;