import React from 'react';
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from '../../../app/store';
import { 
    fetchAsyncGetMorePosts,
    selectNextPageLink,
} from '../../pages/Post/postSlice';
import styles from './GetMorePost.module.css'
const GetMorePost: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const nextPageLink =useSelector(selectNextPageLink);
    
    const getMorePost = async() => {
        const result = await dispatch(fetchAsyncGetMorePosts(nextPageLink));
    }

    return (
        <>
            {nextPageLink &&
                <div
                    className={styles.getMorePostBtn}
                    onClick={getMorePost}
                >
                    さらに読み込む
                </div>
            }  
        </>
    )
}

export default GetMorePost