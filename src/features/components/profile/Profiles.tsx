import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

import { AppDispatch } from "../../../app/store";
import {
  resetOpenProfiles,
  selectOpenProfiles,
  selectProfiles,
  selectProfilesTitle,
} from '../../pages/Auth/authSlice' ;
import styles from './Profiles.module.css';

const customStyles = {
    overlay: {
      backgroundColor: "rgba(1, 111, 233, 0.5)",
      // backdropFilter: "blur(5px)",
      zIndex: 100,
    },
    content: {
      top: "50%",
      left: "50%",
      width: 300,
      height: 500,
      padding: "20px",
      transform: "translate(-50%, -50%)",
    },
  };

const Profiles: React.FC = () => {
    Modal.setAppElement("#root");
    const dispatch: AppDispatch = useDispatch();
    const openProfiles = useSelector(selectOpenProfiles);
    const profiles = useSelector(selectProfiles);
    const profilesTitle = useSelector(selectProfilesTitle);

    if(!profiles){
      return null
  }

    return (
        <Modal
            isOpen={openProfiles}
            onRequestClose={ () => {
                dispatch(resetOpenProfiles());
            }}
            style={customStyles}
        >
            <div className={styles.profiles}>
              <div className={styles.profiles_title}>{profilesTitle}</div>
                {profiles
                  .map((prof, index) => ( 
                    <div key={index} >
                      <Link 
                        style={{ textDecoration: 'none', color: 'black', fontWeight: 'bolder'}} 
                        to={`/prof/${prof.user.id}/`}
                        onClick={() => {dispatch(resetOpenProfiles());}}
                      > 
                          <div className={styles.profile_link}>
                            {/* <Avatar>{prof.name.slice(0, 1)}</Avatar> */}
                            <Avatar alt="who?" src={prof.img} />
                            <div className={styles.nick_name}>{prof.nickName}</div>
                          </div>
                      </Link>
                      <hr/>
                    </div>
                  ))
                }
            </div>
        </Modal>
    )
};

export default Profiles;