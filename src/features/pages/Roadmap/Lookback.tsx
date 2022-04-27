import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import NoteIcon from '@mui/icons-material/Note';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import BatteryCharging50Icon from '@mui/icons-material/BatteryCharging50';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { AppDispatch } from '../../../app/store';
import AddLookback from '../../components/roadmap/AddLookback';
import UpdateLookback from '../../components/roadmap/UpdateLookback';
import { 
    fetchAsyncGetLookbacks, 
    fetchAsyncGetStep,
    selectLookbacks,
    setOpenRoadmap,
    fetchAsyncDeleteLookBack, 
    fetchLookBackDelete,
    selectStep, 
} from './roadmapSlice';
import { 
    fetchAsyncRefreshToken,
    selectMyProfile,
} from '../Auth/authSlice';
import styles from './Lookback.module.css'
import axios from 'axios';

const Lookback: React.FC = () => {
    // const classes = useStyles();

    const lookbacks = useSelector(selectLookbacks);
    const dispatch: AppDispatch = useDispatch();
      let navigate = useNavigate();


    // interface idParams {id: string;}
    const { id } = useParams();

    const myProfile = useSelector(selectMyProfile);
    const loginId = myProfile.user.id
    const step = useSelector(selectStep);

    const [newLookbackOpen, setNewLookbackOpen] = useState<boolean>(false);
    const handleClickOpenNewLookback = () => {
        setNewLookbackOpen(true);
    }
    const handleCloseNewLookback = () => {
        setNewLookbackOpen(false)
    }

    const [selectedLookbackId, setSelectedLookbackId] = useState<string>("");
    const [selectedLookbackLearned, setSelectedLookbackLearned] = useState<string>("");
    const updateLookback = ((lookback :any) => {
        setSelectedLookbackId(lookback.id)
        setSelectedLookbackLearned(lookback.learned)
        dispatch(setOpenRoadmap())
    })

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
      setDeleteOpen(true);
    };
  
    const handleClose = () => {
      setDeleteOpen(false);
    };

    const deleteLookback = (async(lookbackId :string) =>{
        const result = await dispatch(fetchAsyncDeleteLookBack(lookbackId));
        if(fetchAsyncDeleteLookBack.rejected.match(result)){
            await dispatch(fetchAsyncRefreshToken());
            const retryResult = await dispatch(fetchAsyncDeleteLookBack(lookbackId));
            if(fetchAsyncDeleteLookBack.rejected.match(retryResult)){
                navigate(`/auth/login`);
            }else if (fetchAsyncDeleteLookBack.fulfilled.match(retryResult)){
                dispatch(fetchLookBackDelete(lookbackId));
                handleClose();
            }
        }else if(fetchAsyncDeleteLookBack.fulfilled.match(result)){
            dispatch(fetchLookBackDelete(lookbackId));
            handleClose();
        }
    })

    const editedLookback = (lookback: string) => {
        // 改行、半角スペース、全角スペースをを明示化（特殊文字の名前と同じ文字列に）する
        let lookbackText = lookback.replaceAll(/\r?\n/g, '&nbsp;').replaceAll(' ', '&ensp;').replaceAll('　', '&emsp;').replaceAll('**', '&fontsize;')
        // 改行、半角スペース、または、全角スペースでテキストを分割し、リスト化する。（）を使うことで改行などもリストの要素にする
        let lookbackList = lookbackText.split(/(&fontsize;|&nbsp;|&ensp;|&emsp;)/g)
        // 表示するテキストを生成
        const lookback_after: JSX.Element = <div>
            {lookbackList.map((value, index) => {
                if( value.charAt(0)==="#" ){
                    if( value.charAt(1)==="#" ){
                        if( value.charAt(2)==="#" ){
                            // # が３つの場合
                            return <span className={styles.three_hashtag} key={index}>{value.slice(3)}</span>
                        }
                        // # が２つの場合
                        return <span className={styles.two_hashtag} key={index}>{value.slice(2)}</span>
                    }
                    // # が１つの場合
                    return <span className={styles.one_hashtag} key={index}>{value.slice(1)}</span>
                }else if(value.slice(0,2)==='r#'){
                    return <span className={styles.red} key={index}>{value.slice(2)}</span>
                }else if(value.slice(0,2)==='b#'){
                    return <span className={styles.blue} key={index}>{value.slice(2)}</span>
                }else if(value.slice(0,2)==='g#'){
                    return <span className={styles.green} key={index}>{value.slice(2)}</span>
                }else if(value==='&nbsp;'){
                    // 改行の要素
                    return <br key={index}/>
                }else if(value==='&ensp;'){
                    // 半角スペースの要素
                    return <span key={index}>&ensp;</span>
                }else if(value==='&emsp;'){
                    // 全角スペースの要素
                    return <span key={index}>&emsp;</span>
                }else if(value==="&fontsize;"){
                    return null
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
                }
            }
            )}
        </div>
        return lookback_after
    }

    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetLookbacks(String(id)));
            if(fetchAsyncGetLookbacks.rejected.match(result)){
                await dispatch(fetchAsyncRefreshToken());
                const retryResult = await dispatch(fetchAsyncGetLookbacks(String(id)));
                if(fetchAsyncGetLookbacks.rejected.match(retryResult)){
                    navigate(`/auth/login`);
                }else if(fetchAsyncGetLookbacks.fulfilled.match(retryResult)){
                    await dispatch(fetchAsyncGetStep(String(id)));
                }
            }else if(fetchAsyncGetLookbacks.fulfilled.match(result)){
                await dispatch(fetchAsyncGetStep(String(id)));
            }
        }
        func();
        // console.log()
    }, [dispatch, id])
    if(!lookbacks){
        return null
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}></div>
            <div className={styles.new_lookback}>
                {step.challenger==loginId ?
                    <>
                        {newLookbackOpen ? 
                                <>
                                    <div
                                        className={styles.new_lookback_button}
                                        onClick={handleCloseNewLookback}
                                    >
                                        閉じる
                                    </div>
                                    <AddLookback stepId={String(id)} />
                                </>
                            :
                                <>
                                    <div
                                        className={styles.new_lookback_button}
                                        onClick={handleClickOpenNewLookback}
                                    >
                                        ノートを追加
                                    </div>
                                    <div className={styles.title}>ステップ</div>
                                    <div
                                        className={
                                        `${
                                            styles.step
                                        } ${
                                        step.isCompleted==="left_untouched" && styles.left_untouched_step
                                        } ${
                                            step.isCompleted==="going" && styles.going_step
                                        }`} 
                                    >
                                        <div className={styles.progress}>
                                            {step.isCompleted==="left_untouched" &&
                                                <div className={styles.left_untouched}><Battery0BarIcon/></div>
                                            }
                                            {step.isCompleted==="going" &&

                                                <div className={styles.going}><BatteryCharging50Icon/></div>
                                            }
                                            {step.isCompleted==="is_completed" &&
                                                <div className={styles.is_completed}><BatteryChargingFullIcon/></div>
                                            }
                                        </div>
                                        <div className={styles.to_learn}>{step.toLearn}</div>
                                    </div>
                                </>
                        }
                    </>
                :
                    <>
                        <div className={styles.title}>ステップ</div>
                        <div className={styles.step}>
                            <div className={styles.to_learn}>{step.toLearn}</div>
                        </div>
                    </>
                }
                <div className={styles.preview_lookbacks}>
                    {lookbacks[0] &&
                        <div className={styles.title}>ノート一覧</div>
                    }
                    {
                        lookbacks.map((lookback, index) => (
                            <div 
                                key={index} 
                                className={styles.preview_lookback}
                                onClick={() => {
                                    setSelectedLookbackId(lookback.id);
                                    setSelectedLookbackLearned(lookback.learned);
                                }}
                            >
                                <div className={styles.preview_lookback_content}>
                                    <div className={styles.hidden}>
                                        {lookback.learned}
                                        {/* ▶︎{editedPreviewLookback(lookback.learned)} */}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            
            <div className={styles.lookbacks}>
            {
                lookbacks.map((lookback, index) => ( 
                    <div  key={index}>                    
                        {
                            lookback.id===selectedLookbackId &&
                            <div className={styles.lookback}>
                                {step.challenger===loginId &&
                                    <div className={styles.icon_buttons}>
                                        <IconButton 
                                            aria-label="delete" 
                                            // className={classes.margin}
                                            onClick={() => {
                                                setSelectedLookbackId(lookback.id);
                                                setSelectedLookbackLearned(lookback.learned);
                                                handleClickOpen();
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                            aria-label="update" 
                                            // className={classes.margin}
                                            onClick={() => updateLookback(lookback)}
                                        >
                                            <CreateIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                }
                                <div className={styles.lookback_content}>
                                    {/* {lookback.learned} */}
                                    {editedLookback(lookback.learned)}
                                </div>
                            </div>
                        }
                    </div>
                ))
            
            }
            </div>
            <div className={styles.footer}></div>

            <UpdateLookback lookbackId={selectedLookbackId} learned={selectedLookbackLearned} />
            <Dialog
                open={deleteOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {selectedLookbackLearned.slice(0, 10)}… を削除しますか？
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                {/* onClick={() => deleteRoadmap(roadmap.id)} */}
                <Button onClick={() => {deleteLookback(selectedLookbackId);}} color="primary">
                    はい
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    いいえ
                </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Lookback