import React, {useState, useEffect} from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Avatar from '@mui/material/Avatar';

import { AppDispatch } from '../../../app/store';
import {
    setOpenRoadmap,
    selectRoadmaps,
    fetchAsyncGetRoadmaps,
    fetchAsyncGetOwnRoadmaps,
    fetchAsyncDeleteRoadmap, 
    fetchRoadmapDelete,
    selectRoadmapPagenation,
    fetchAsyncGetRoadmapsMore,
    fetchAsyncGetFollowingsRoadmaps

}from './roadmapSlice';
import { selectMyProfile } from '../Auth/authSlice';
import UpdateRoadmap from '../../components/roadmap/UpdateRoadmap';
// import SearchRoadmap from './SearchRoadmap';
import styles from './Roadmap.module.css'


const FollowingRoadmap: React.FC = () => {
  const { word } = useParams();
  const dispatch: AppDispatch = useDispatch();
  let navigate = useNavigate();
  interface idParams {id: string;}
  const { id } = useParams();

  const myProfile = useSelector(selectMyProfile);
  const loginId = myProfile.user.id

  const roadmaps = useSelector(selectRoadmaps);
  const roadmapPagenation =useSelector(selectRoadmapPagenation);


  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>("");
  const [selectedRoadmapTitle, setSelectedRoadmapTitle] = useState<string>("");
  const [selectedRoadmapOverview, setSelectedRoadmapOverView] = useState<string>("");
  const [selectedRoadmapIsPublic, setSelectedRoadmapIsPublic] = useState<string>("");

  // 表示されている画面が、ユーザーの学習計画か全体の学習計画かの状態を管理
  const [isUserRoadmaps, setIsUserRoadmamps] = useState<boolean>(true);
  const handleIsUserRoadmaps = () => {
      setIsUserRoadmamps(true);
  }
  const handleIsRoadmaps = () => {
      setIsUserRoadmamps(false);
  }

  // deleteの確認画面の表示を管理
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const handleClickOpen = () => {
    setDeleteOpen(true);
  };
  const handleClose = () => {
    setDeleteOpen(false);
  };

  const deleteRoadmap = async(roadmapId :string) => {
      const result = await dispatch(fetchAsyncDeleteRoadmap(roadmapId));
      if(fetchAsyncDeleteRoadmap.fulfilled.match(result)){
          dispatch(fetchRoadmapDelete(roadmapId));
          handleClose();
      }
  }

  const setOpenUpdateRoadmap = ((roadmap :any) => {
      setSelectedRoadmapId(roadmap.id)
      setSelectedRoadmapTitle(roadmap.title)
      setSelectedRoadmapOverView(roadmap.overview)
      setSelectedRoadmapIsPublic(roadmap.isPublic)
      dispatch(setOpenRoadmap())
  })
  
  useEffect(()=>{
    const func = async () => {
        if(String(word).length!==0){
            const result = await dispatch(fetchAsyncGetFollowingsRoadmaps());
        }
    }
    func();
  }, [dispatch, word])
  if(!roadmaps){
    return null
  }
  return (
    <div className={styles.container}>
    <div className={styles.navigation}>
        <div
            className={`${styles.roadmaps}`}
            onClick={() => {
              navigate(`/`);
            }}
        >
         つぶやき
        </div>
        <div
            className={`${styles.user_roadmaps} ${styles.is_user_roadmaps}`}

            onClick={async() => {
                const result = await dispatch(fetchAsyncGetFollowingsRoadmaps());
                // if(fetchAsyncGetOwnRoadmaps.rejected.match(result)){

                // }else if(fetchAsyncGetOwnRoadmaps.fulfilled.match(result)){
                //     handleIsUserRoadmaps();
                // }
            }}
        >
             計画
        </div>
    </div>
    {/* <div className={styles.search_roadmap}>
        {!isUserRoadmaps && <SearchRoadmap/>}
    </div> */}

    {
        roadmaps.map((roadmap, index) => ( 
            <div key={index} className={styles.roadmap}>
                <div className={styles.roadmap_dates}>
                    {roadmap.createdAt!==roadmap.updatedAt ?
                        <div>更新：{roadmap.updatedAt}</div>
                        :
                        <div></div>
                    }
                    <div>作成：{roadmap.createdAt}</div>
                </div>
                <div className={styles.challenger}>
                    <div></div>
                    <Link 
                        style={{textDecoration: 'none', color: '#575e4e', display: 'flex'}}
                        to={`/prof/${roadmap.challenger.id}/`}
                    > 
                        {/* <div className=''> */}
                            {/* by */}
                            <Avatar 
                                alt="who?" 
                                src={roadmap.profile.img} 
                                sx={{ width: 30, height: 30, border: 0.5, borderColor: 'black'}}
                            />
                            <div className={styles.nick_name}>{roadmap.profile.nickName}</div>
                        {/* </div> */}
                    </Link>
                </div>


                <div className={styles.roadmap_title}>{roadmap.title}</div>

                <div className={styles.roadmap_overview}>{roadmap.overview}</div>
                <div 
                    className={roadmap.challenger.id === loginId ? 
                        `${styles.additional_elements}  ${styles.is_own_roadmap}` : `${styles.additional_elements}`}
                >
                    { roadmap.challenger.id === loginId &&
                        <div className={styles.icon}>
                            <IconButton 
                                aria-label="delete" 
                                // className={classes.margin}
                                onClick={() => {
                                    setSelectedRoadmapId(roadmap.id);
                                    setSelectedRoadmapTitle(roadmap.title);
                                    handleClickOpen();
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>

                            <IconButton 
                                aria-label="update" 
                                // className={classes.margin}
                                onClick={() => setOpenUpdateRoadmap(roadmap)}
                            >
                                <CreateIcon fontSize="small" />
                            </IconButton>
                        </div>
                    }                    
                    <div 
                        onClick={() => { 
                            navigate(`/step/roadmap/${roadmap.id}/`); 
                        }}
                        className={styles.to_steps} 
                    >
                        詳細へ
                    </div>
                </div>

            </div>
        )
        )
    }
    <div className={styles.pagination}>
    {roadmapPagenation.previous &&  
      <div onClick={
        async() => {
          const result = await dispatch(fetchAsyncGetRoadmapsMore(roadmapPagenation.previous));
          if (fetchAsyncGetRoadmapsMore.rejected.match(result)) {
          }
        }
        }
      >
        前へ
      </div>
    }
  
    {roadmapPagenation.next && 
      <div onClick={
        async() => {
          const result = await dispatch(fetchAsyncGetRoadmapsMore(roadmapPagenation.next));
            if (fetchAsyncGetRoadmapsMore.rejected.match(result)) {

            
            }
          }
        }
      >
        次へ
      </div>
    }
  </div>

    <UpdateRoadmap roadmapId={selectedRoadmapId} title={selectedRoadmapTitle} overview={selectedRoadmapOverview} isPublic={selectedRoadmapIsPublic} />
    
    <Dialog
        open={deleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            {selectedRoadmapTitle} を削除しますか？
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => {deleteRoadmap(selectedRoadmapId);}} color="primary">
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

export default FollowingRoadmap