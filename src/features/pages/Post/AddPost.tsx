import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// import Swal from 'sweetalert2'
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
  fetchAsyncNewPost,
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
} from "./postSlice";
import {
    fetchAsyncRefreshToken,
    selectMyProfile
} from "../Auth/authSlice"
import styles from "./AddPost.module.css";


const AddPost: React.FC= () => {
    const isLoadingPost = useSelector(selectIsLoadingPost);
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const myprofile = useSelector(selectMyProfile);

    return (
        <div>
            <Formik
                initialErrors={{ post: "required" }}

                initialValues={{
                    post: "",
                    // isPublic: "private",
                }}
                onSubmit={async (values) => {
                    dispatch(fetchPostStart());
                    const result = await dispatch(fetchAsyncNewPost(values));
                    if (fetchAsyncNewPost.rejected.match(result)) {
                        await dispatch(fetchAsyncRefreshToken())
                        const retryResult =  await dispatch(fetchAsyncNewPost(values));
                        if (fetchAsyncNewPost.rejected.match(retryResult)) {
                            navigate("/auth/login")
                        }else if (fetchAsyncNewPost.fulfilled.match(retryResult)) {
                            dispatch(fetchPostEnd());
                            navigate(`/prof/${myprofile.user.id}`)
                        }

                        dispatch(fetchPostEnd());
                    }else if (fetchAsyncNewPost.fulfilled.match(result)) {
                        dispatch(fetchPostEnd());
                        navigate(`/prof/${myprofile.user.id}`)
                    }
                    // dispatch(fetchPostEnd());
                }}
                validationSchema={
                    Yup.object().shape({
                    post: Yup.string()
                        .required("??????????????????????????????")
                        .max(250, "250??????????????????????????????????????????"),   
                    // isPublic: Yup.string()
                    //     .required("??????????????????????????????"),
                })}
            >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
            }) => (
                <div className={styles.add_post}>
                    <h1 className={styles.add_post_title}>??????</h1>
                    <div className={styles.add_post_progress}>
                            {isLoadingPost && <CircularProgress />}
                    </div>
                    <form className={styles.add_post_form} onSubmit={handleSubmit}>
                        <div>
                        <TextField
                            id="outlined-textarea"
                            label="??????"
                            style={{ marginTop: 10 }}
                            fullWidth
                            multiline
                            variant="outlined"
                            type="input"
                            name="post"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.post}
                        />
                        {touched.post && errors.post ? (
                            <div className={styles.add_post_error}>{errors.post}</div>
                        ) : null}
                        <br />
                        <div className={styles.add_post_button}>
                            {/* <FormControl>
                                <Select
                                    sx={{ height: 40, marginTop: 5, marginBottom: 5 }}
                                    native
                                    // style={{ margin: 10 }}
                                    value={values.isPublic}
                                    onChange={handleChange}
                                    inputProps={{
                                    name: 'isPublic',
                                    id: 'age-native-simple',
                                    }}
                                >
                                    <option value={"public"}>??????</option>
                                    <option value={"private"}>?????????</option>
                                </Select>
                            </FormControl>

                            {touched.isPublic && errors.isPublic ? (
                            <div className="add_post_error">{errors.isPublic}</div>
                            ) : null}
                            <br /> */}
                            <div></div>
                            <div className={styles.add_post_notes}>
                                <p>??????????????????????????????250????????????</p>
                                <p>?????????????????????????????????????????????????????????</p>
                            </div>
                            <br />
                            
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={!isValid}
                                type="submit"
                            >
                                ????????????
                            </Button >                    
                        </div>
                        </div>
                    </form>
                </div>
            )}
            </Formik>  
        </div>
    )
}

export default AddPost