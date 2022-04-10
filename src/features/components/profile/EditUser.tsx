import React, { useRef, useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { AppDispatch } from "../../../app/store";

import {
  selectMyProfile,
  editUserName,
  resetOpenProfile,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateAccountName,
  selectOpenUpdateUser,
  resetOpenUser,
} from "../../pages/Auth/authSlice";
import {
  fetchUpdateProf,
} from "../../pages//Post/postSlice"
import styles from './EditProfile.module.css'

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
    height: 150,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const EditUser:React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openUser = useSelector(selectOpenUpdateUser);
  const myprofile = useSelector(selectMyProfile);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  // 投稿のUpdateの処理
  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet =  { 
      name: myprofile.user.username, 
      id: myprofile.user.id, 
    };
    dispatch(fetchCredStart());
    const result = await dispatch(fetchAsyncUpdateAccountName(packet));
    if(fetchAsyncUpdateAccountName.fulfilled.match(result)){
        dispatch(fetchCredEnd());
        // dispatch(fetchUpdateProf({postedBy: account.id, name: account.name}));
        dispatch(resetOpenUser());
    }

  }
//   const [inputError, setInputError] = useState(false);

//   const inputRef = useRef(null);

//   const handleChange = () => {
//     if (inputRef.current) {
//       const ref = inputRef.current;
//       if (!ref.validity.valid) {
//         setInputError(true);
//       } else {
//         setInputError(false);
//       }
//     }
//   };

  return (
    <>
      <Modal
        isOpen={openUser}
        onRequestClose={async () => {
            dispatch(resetOpenUser());
        }}
        style={customStyles}
      >
        <div className={styles.edit_prof}>
          {/* <div className={styles.edit_prof_title}>編集</div> */}
        
          <div className={styles.edit_progress}>
            {isLoadingAuth && <CircularProgress />}
          </div>

          <form className={styles.edit_prof_form}>
            <TextField
              id="standard-basic" label="ユーザーネーム（８文字以内）"
              type="text"
              fullWidth
              inputProps={{maxLength: 8 }}
              value={myprofile?.user.username}
              onChange={(e) => {
                if(e.target.value.match(/^[a-zA-Z0-9_]+$/)){
                    dispatch(editUserName(e.target.value))
                }
              }}
            />
            <div className={styles.edit_prof_button}>
              <Button
                disabled={!myprofile?.user.username}
                // variant="contained"
                variant="outlined"
                color="primary"
                type="submit"
                onClick={updateProfile}
              >
                ユーザーネームを変更
              </Button>
            </div>
          </form>        
        </div>
      </Modal>
    </>
  );
};

export default EditUser;