import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
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

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import BatteryCharging50Icon from '@mui/icons-material/BatteryCharging50';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import styles from './Step.module.css';
import { AppDispatch } from '../../../app/store';
import AddStep from '../../components/roadmap/AddStep';
import UpdateStep from '../../components/roadmap/UpdateStep';
import { 
    fetchChangeStepOrder, 
    fetchAsyncGetSteps, 
    // selectRoadmaps, 
    selectSteps, 
    setOpenRoadmap, 
    fetchAsyncDeleteStep, 
    fetchStepDelete, 
    fetchAsyncChangeStepOrder, 
    selectRoadmap,
    fetchAsyncGetRoadmap
} from './roadmapSlice';
import { 
    // fetchAsyncRefreshToken, 
    // setOpenLogIn,
    selectMyProfile,
} from '../Auth/authSlice';
import { Avatar } from '@mui/material';
import axios from 'axios';

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     margin: {
//       margin: theme.spacing(1),
//     },
//   }),
// );

const Step: React.FC = () => {
    // const classes = useStyles();
    const steps = useSelector(selectSteps);

    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    interface idParams {id: string;}
    const { id } = useParams();

    const myProfile = useSelector(selectMyProfile);
    const loginId = myProfile.user.id
    const roadmap = useSelector(selectRoadmap);


    const [newStepOpen, setNewStepOpen] = useState<boolean>(false);
    const handleClickOpenNewStep = () => {
        setNewStepOpen(true);
    }
    const handleCloseNewStep = () => {
        setNewStepOpen(false)
    }
    const [selectedStepId, setSelectedStepId] = useState<string>("");
    const [selectedStepToLearn, setSelectedStepToLearn] = useState<string>("");
    const [selectedStepIsCompleted, setSelectedStepIsCompleted] = useState<string>("");

    const updateStep = ((step :any) => {
        setSelectedStepId(step.id)
        setSelectedStepToLearn(step.toLearn)
        setSelectedStepIsCompleted(step.isCompleted)
        dispatch(setOpenRoadmap())
    })

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
      setDeleteOpen(true);
    };
  
    const handleClose = () => {
      setDeleteOpen(false);
    };

    const deleteStep = async(stepId :string) =>{
        const result = await dispatch(fetchAsyncDeleteStep(stepId));
        if(fetchAsyncDeleteStep.fulfilled.match(result)){
            dispatch(fetchStepDelete(stepId));
            handleClose();
        }
    }

    const [changeStepOrderOpen, setChangeStepOrderOpen] = useState<boolean>(false);
    const handleClickOpenChangeStepOrder = () => {
        setChangeStepOrderOpen(true);
    }
    const handleCloseChangeStepOrder = () => {
        setChangeStepOrderOpen(false)
    }
    const changeStepOrder = async() => {
        const result = await dispatch(fetchAsyncChangeStepOrder({"steps":steps}));
        if(fetchAsyncChangeStepOrder.fulfilled.match(result)){
            handleCloseChangeStepOrder();
        }
    }

    useEffect(() => {
        const func = async () => {
            const result = await dispatch(fetchAsyncGetSteps(id));
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;
            await dispatch(fetchAsyncGetRoadmap(id));
        }
        func();
    }, [dispatch, id, selectedStepId, selectedStepToLearn, selectedStepIsCompleted])
    if(!steps){
        return null
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}></div>

            {roadmap.challenger.id===loginId ?
                <div className={styles.new_step}>
                    {newStepOpen ? 
                        <>
                            <div
                                className={styles.new_step_button}
                                onClick={handleCloseNewStep}
                        
                            >
                                閉じる
                            </div>
                            <AddStep roadmapId={String(id)} />
                        </>
                    : 
                        <>
                            <div
                                className={styles.new_step_button}
                                onClick={handleClickOpenNewStep}
                            >
                                ステップを追加
                            </div>
                            <div className={styles.roadmap}>
                                <Link 
                                    style={{textDecoration: 'none', color: '#575e4e', display: 'flex', padding: 10}}
                                    to={`/prof/${roadmap.challenger.id}/`}
                                > 
                                    {/* <div className=''> */}
                                        {/* by */}
                                        <Avatar
                                            alt="who?" 
                                            src={roadmap.profile.img} 
                                            sx={{ width: 30, height: 30, border: 0.5, borderColor: 'black',  marginRight: 1}}
                                        />
                                        <div className={styles.nick_name}>{roadmap.profile.nickName}</div>
                                    {/* </div> */}
                                </Link>
                                <div className={styles.roadmap_title}>{roadmap.title}</div>
                                <div className={styles.roadmap_overview}>{roadmap.overview}</div>
                            </div>
                        </>
                    }                
                </div>
            :
                <div className={styles.new_step}>
                    <div className={styles.roadmap}>
                        <Link 
                            style={{textDecoration: 'none', color: '#575e4e', display: 'flex', padding: 10}}
                            to={`/prof/${roadmap.challenger.id}/`}
                        > 
                            {/* <div className=''> */}
                                {/* by */}
                                <Avatar
                                    alt="who?" 
                                    src={roadmap.profile.img} 
                                    sx={{ width: 30, height: 30, border: 0.5, borderColor: 'black', marginRight: 1}}
                                />
                                <div className={styles.nick_name}>{roadmap.profile.nickName}</div>
                            {/* </div> */}
                        </Link>
                        <div className={styles.roadmap_title}>{roadmap.title}</div>
                        <div className={styles.roadmap_overview}>{roadmap.overview}</div>
                    </div>
                </div>
            }
           
            <div className={styles.step_list}>
                {(roadmap.challenger.id===loginId&&steps[0]&&changeStepOrderOpen===true) &&
                    <div 
                        className={styles.edit_order} 
                        onClick={changeStepOrder}
                    >
                        並び替えを確定
                    </div>
                }

                {
                steps.map((step, index) => ( 
                    <div key={index}>
                        <div className={styles.down_icon}>
                            {index!==0 && <ArrowDropDownIcon sx={{ color: 'white' }}/> }
                        </div>

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
                            <div className={styles.step_header}>
                                <div className={styles.step_order}>{index+1}</div>
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
                            </div>

                            <div className={styles.to_learn}>
                                {step.toLearn}
                            </div>

                                <div className={styles.aditional_elements}>
                                    {roadmap.challenger.id===loginId ?
                                        <>
                                            {index!==0 ?
                                                <IconButton 
                                                    aria-label="changeOrder" 
                                                    // className={classes.margin} 
                                                    // size="small" 
                                                    onClick={() => {
                                                            dispatch(fetchChangeStepOrder(index));
                                                            handleClickOpenChangeStepOrder();
                                                        }}
                                                >
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                                :
                                                <div className={styles.space}></div>
                                            }

                                            <IconButton 
                                                aria-label="delete" 
                                                // className={classes.margin}
                                                // onClick={() => deleteStep(step.id)}
                                                onClick={() => {
                                                    setSelectedStepId(step.id);
                                                    setSelectedStepToLearn(step.toLearn);
                                                    handleClickOpen();
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                aria-label="update" 
                                                // className={classes.margin}
                                                onClick={() => updateStep(step)}
                                            >
                                                <CreateIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                        :
                                        <>
                                            <div className={styles.space}></div>
                                        </>
                                    }

                                    {/* <Link
                                        style={{ textDecoration: 'none', color: 'black', fontWeight: 'bolder', paddingLeft: '20px', margin: 'auto 0'}} 
                                        to={`/lookback/step/${step.id}/`}
                                    > ノート</Link> */}
                                    <IconButton 
                                        aria-label="note" 
                                        // className={classes.margin}
                                        onClick={() => 
                                            navigate(`/lookback/step/${step.id}/`)
                                        }
                                    >
                                        <NoteIcon fontSize="small" />
                                    </IconButton>
                                </div>
                        </div>
                    </div>
                ))
                }
                <UpdateStep stepId={selectedStepId} toLearn={selectedStepToLearn} isCompleted={selectedStepIsCompleted} />

                <Dialog
                    open={deleteOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {selectedStepToLearn}  を削除しますか？
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    {/* onClick={() => deleteRoadmap(roadmap.id)} */}
                    <Button onClick={() => {deleteStep(selectedStepId);}} color="primary">
                        はい
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        いいえ
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default Step