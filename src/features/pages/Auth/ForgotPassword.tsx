import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
    fetchAsyncForgotPassword,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
} from "./authSlice";
import styles from "./Auth.module.css";

const ForgotPassword: React.FC = () => {
    let navigate = useNavigate();

    const [openMessage, setOpenMessage] = useState<boolean>(false);

    const dispatch: AppDispatch = useDispatch();
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
  return (
    <Formik
        initialErrors={{ email: "required" }}
        initialValues={{ email: "" }}
        onSubmit={ async (values) => {
        // Display a CircularProgress
        dispatch(fetchCredStart());
        // Fetch  
        const loginResult = await dispatch(fetchAsyncForgotPassword(values));
        if (fetchAsyncForgotPassword.fulfilled.match(loginResult)) {
            //   Display a Success Message
            setOpenMessage(true)
            // Hide a CircularProgress
            dispatch(fetchCredEnd());
        }else{
            // Hide a CircularProgress
            dispatch(fetchCredEnd());
        }
        }}
        validationSchema={
            Yup.object().shape({
                email: Yup
                    .string()
                    .email("有効なメールアドレスではありません。")
                    .required("メールアドレスは必須です。")
            })
        }
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
        <div className={styles.auth_page}>
            <form onSubmit={handleSubmit} className={styles.auth_form}>
            <div>
                {/* Title */}
                <h1 className={styles.auth_title}>パスワードをリセット</h1>
                
                {/* Success Message */}
                {openMessage &&
                    <div className={styles.auth_message}>メールを確認して下さい。</div>
                }

                {/* CircularProgress */}
                <div className={styles.auth_progress}>
                {isLoadingAuth && <CircularProgress />}
                </div>
                <br />

                <TextField
                    label="メールアドレス"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    fullWidth
                />

                {/* Error Message */}
                {touched.email && errors.email ? (
                <div className={styles.auth_error}>{errors.email}</div>
                ) : null}
                <br />

                {/* Submit Button */}
                <div className={styles.auth_button}>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={!isValid}
                    type="submit"
                >
                    メールを送信
                </Button>
                </div>
                <br />

                {/* To Login Page */}
                <p className={styles.auth_text}>
                <span
                    className={styles.auth_span}
                    onClick={() => {
                    navigate("/auth/login")
                    }}
                >ログインはこちら
                </span>
                </p>

                {/* To Registration Page */}
                <p className={styles.auth_text}>
                <span
                    className={styles.auth_span}
                    onClick={() => {
                    navigate("/auth/register")
                    }}
                >アカウント登録はこちら
                </span>
                </p>
            </div>
            </form>
        </div>
        )}
    </Formik>
  )
}

export default ForgotPassword