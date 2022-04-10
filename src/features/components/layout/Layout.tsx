import React, { useState, useEffect }  from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import { AppDispatch } from '../../../app/store';
import SwipeableTemporaryDrawer from './SwipeableTemporaryDrawer';
import {
    selectMyProfile,
    logOut,
    fetchAsyncLogout,
    fetchAsyncGetMyProf,
} from "../../pages/Auth/authSlice";
import {
    fetchAsyncGetSearchedPosts,
} from "../../pages/Post/postSlice";
import axios from 'axios';

const Layout: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const myprofile = useSelector(selectMyProfile);
    // const [auth, setAuth] = useState<boolean>(false);
    const [activeLink, setActiveLink] = useState("");
    const [keyword, setKeyword] = useState("");

    useEffect(()=>{
        // ログイン済みかどうか検証
        const func = async () => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;
            const result = await dispatch(fetchAsyncGetMyProf());
            // if(fetchAsyncGetMyProf.rejected.match(result)){
            //   navigate("/auth/login");
            // }
            // navigate("/")
        };
        func();
    }, [dispatch])
    return (
        <>
            {/* HEADER */}
            <header className={styles.header}>
                <div className={styles.header__container}>
                    <div>
                        <Link to={"/"} className={styles.header__logo}>
                        <i className="bx bx-paper-plane"></i>
                            ry-log
                        </Link>
                    </div>
                    {/* <div className={styles.header__logo}></div> */}
        
                    <form 
                        className={styles.header__search}
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                navigate(`/search/${keyword}/`);
                            }
                        }
                    >
                        <input 
                            type="text" 
                            placeholder="キーワード検索" 
                            className={styles.header__input}
                            value={keyword}
                            // minLength={1}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <i className={`bx bx-search ${styles.header__icon}`}></i>
                    </form>

                    {/* <div className={styles.header__img}></div> */}
                    {/* <img src="./perfil.jpg" alt="" className={styles.header__img} /> */}
                    {/* <img src={bgImage} alt="profile" className={styles.header__img} /> */}

                    {myprofile.id === "" ?
                        <Link to={"/auth/login"} className={styles.nav__link}>
                            <i className={`bx bx-log-in-circle ${styles.nav__icon}`}></i>
                            <span className={styles.nav__name}>ログイン</span>
                        </Link>
                    :
                        <Link 
                            to={"/"} 
                            className={styles.nav__link}  
                            onClick={
                                async() => {
                                    await dispatch(fetchAsyncLogout());
                                    dispatch(logOut());
                                    navigate("/auth/login")
                                }
                            }
                        >
                            <i className={`bx bx-log-out-circle ${styles.nav__icon}`}></i>
                            <span className={styles.nav__name}>ログアウト</span>
                        </Link>
                    }
        
                </div>
            </header>

            {myprofile.id !== "" &&

                <div className={styles.nav}>
                    <div className={styles.nav__menu} id="nav-menu">
                        <ul className={styles.nav__list}>
                            {/* <li className={styles.nav__item} onClick={() =>  setActiveLink("home")}> */}
                            <li className={styles.nav__item}>
                                <Link to={"/"} className={`${styles.nav__link} ${activeLink=="home" && styles.active__link}`}>
                                {/* <a href="#home" className={`${styles.nav__link} ${activeLink=="home" && styles.active__link}`}> */}
                                    <i className={`bx bx-home-alt ${styles.nav__icon}`}></i>
                                    <span className={styles.nav__name}>ホーム</span>
                                {/* </a> */}
                                </Link>
                            </li>

                            {/* <li className={styles.nav__item} onClick={() =>  setActiveLink("post")}> */}
                            <li className={styles.nav__item}>
                                <Link to={"/post/list"} className={`${styles.nav__link} ${activeLink=="post" && styles.active__link}`}>
                                    <i className={`bx bx-message-detail ${styles.nav__icon}`}></i>
                                    <span className={styles.nav__name}>つぶやき</span>
                                </Link>
                            </li>

                            <li className={styles.nav__item}>
                                <SwipeableTemporaryDrawer />                            
                            </li>
                            
                            {/* <li className={styles.nav__item} onClick={() =>  setActiveLink("roadmap")}> */}
                            <li className={styles.nav__item}>
                                <Link to={`/roadmap/user/${myprofile.user.id}`} className={`${styles.nav__link} ${activeLink=="roadmap" && styles.active__link}`}>
                                    <i className={`bx bx-paper-plane ${styles.nav__icon}`}></i>
                                    <span className={styles.nav__name}>計画</span>
                                </Link>
                            </li>

                            {/* <li className={styles.nav__item} onClick={() =>  setActiveLink("mypage")}> */}
                            <li className={styles.nav__item}>
                                <Link to={`/prof/${myprofile.user.id}`} className={`${styles.nav__link} ${activeLink=="mypage" && styles.active__link}`}>
                                    <i className={`bx bx-user ${styles.nav__icon}`}></i>
                                    <span className={styles.nav__name}>マイページ</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default Layout