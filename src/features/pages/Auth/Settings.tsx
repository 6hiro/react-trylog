import React, { useState }  from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

import { AppDispatch } from "../../../app/store";
import {
//   selectMyUser,
  selectMyProfile,
  fetchAsyncDeleteAccount,
  logOut,
  setOpenUser,
  fetchAsyncRefreshToken,
} from "../../pages/Auth/authSlice";
import styles from './Settings.module.css'
import EditUser from '../../components/profile/EditUser';


const Settings: React.FC = () => {
    let navigate = useNavigate();
    const myprofile = useSelector(selectMyProfile);
    const dispatch: AppDispatch = useDispatch();

    // Account削除の確認画面の表示の処理
    const [deleteAccountOpen, setDeleteAccountOpen] = useState<boolean>(false);
    const handleClickOpen = () => {
        setDeleteAccountOpen(true);
    };
    const handleClose = () => {
        setDeleteAccountOpen(false);
    };

    // Account削除の処理
    const UserDelete = async() => {
        const result = await dispatch(fetchAsyncDeleteAccount(myprofile.user.id))
        
        if(fetchAsyncDeleteAccount.rejected.match(result)){
            await dispatch(fetchAsyncRefreshToken())
            const retryResult = await dispatch(fetchAsyncDeleteAccount(myprofile.user.id))
            if(fetchAsyncDeleteAccount.fulfilled.match(retryResult)){
                dispatch(logOut());
                navigate("/auth/login")
            }
        }else if(fetchAsyncDeleteAccount.fulfilled.match(result)){
            dispatch(logOut());
            navigate("/auth/login")
        }
        handleClose();
    }
    
    return (
        <div
            className={styles.settings}
        >
            <div
                className={styles.settings_title}
            >
                設定
            </div>
            <br />

            <i className='bx bxs-right-arrow'></i>アカウント更新
            <div
                className={styles.delete_account_button}
                onClick={() => {
                    dispatch(setOpenUser());
                  }}
            >
                アカウントを更新する
            </div>
            <br />
            <br />
            
            <i className='bx bxs-right-arrow'></i>アカウント削除
            <div 
                className={styles.delete_account_button}
                onClick={handleClickOpen}

            >
                アカウントを削除する
            </div>
          
            <EditUser />

            {/* Account削除の確認画面 */}
            <Dialog
                open={deleteAccountOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    本当にアカウントを削除しますか？
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button 
                    onClick={UserDelete} 
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
        </div>
    )
}

export default Settings