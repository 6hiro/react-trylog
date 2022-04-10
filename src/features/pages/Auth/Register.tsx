import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
  fetchAsyncRegister,
  fetchAsyncLogin,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
} from "./authSlice";
import styles from "./Auth.module.css";

const Register: React.FC = () => {
  let navigate = useNavigate();

  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  
  return (
    <Formik
      initialErrors={{ email: "required" }}
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      onSubmit={async (values) => {
        dispatch(fetchCredStart());
        const registrationResult = await dispatch(
          fetchAsyncRegister(
            {
              username:values.name, 
              email:values.email, 
              password:values.password, 
              passwordConfirm:values.confirmPassword
            }
          )
        );

        if (fetchAsyncRegister.fulfilled.match(registrationResult)) {
          await dispatch(fetchAsyncLogin({email:values.email, password:values.password}));
          // await dispatch(fetchAsyncGetMyProf());
          dispatch(fetchCredEnd());
          setOpenMessage(true)
        }else{
          dispatch(fetchCredEnd());
        }
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .matches(/^[0-9a-zA-Z_]+$/, '半角英数字もしくはアンダーバーのみ入力できます。')
          .required("ユーザー名は必須です。")
          .max(191, "191文字以内で入力してください。"),
          // .min(8, "8文字以上で入力してください。"),
        email: Yup.string()
          .email("有効なメールアドレスではありません。")
          .max(191, "191文字以内で入力してください。")
          .required("メールアドレスは必須です。"),
        password: Yup.string()
          .required("パスワードは必須です。")
          .min(8, "8文字以上で入力してください。"),
        confirmPassword: Yup.string()
          .required("パスワード確認は必須です。")
          .oneOf([Yup.ref('password')] , "パスワードと同じ内容を入力してください。"),
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
        <div className={styles.auth_page}>
          <form onSubmit={handleSubmit} className={styles.auth_form}>
            <div>
              <h1 className={styles.auth_title}>アカウント作成</h1>
              {openMessage &&
                    <div className={styles.auth_message}>メールを確認して下さい。</div>
                }
              <div className={styles.auth_progress}>
                {isLoadingAuth && <CircularProgress />}
              </div>
              <br />

              <TextField
                label="ユーザー名"
                type="input"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                fullWidth
              />
              {touched.name && errors.name ? (
                <div className={styles.auth_error}>{errors.name}</div>
              ) : null}
              <br />
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
              {touched.email && errors.email ? (
                <div className={styles.auth_error}>{errors.email}</div>
              ) : null}
              <br />
              <br />

              <TextField
                id="standard-basic" label="パスワード"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                fullWidth
              />
              {touched.password && errors.password ? (
                <div className={styles.auth_error}>{errors.password}</div>
              ) : null}
              <br />
              <br />
              <TextField
                label="パスワード確認"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                fullWidth
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <div className={styles.auth_error}>{errors.confirmPassword}</div>
              ) : null}
              <br />

              <div className={styles.auth_button}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!isValid}
                  type="submit"
                  className={styles.auth_button}
                >
                  登録
                </Button>
              </div>
              <br />
              <p className={styles.auth_text}>
                
                  <span
                    className={styles.auth_span}
                    onClick={() => {
                      navigate("/auth/login")
                    }}
                >
                  ログインはこちら
                </span>
              </p>
            </div>
          </form>
        </div>
      )}
    </Formik>
  )
}

export default Register