import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
  fetchAsyncLogin,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncGetMyProf,
} from "./authSlice";
import styles from "./Auth.module.css";

const Login: React.FC = () => {
    let navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const isLoadingAuth = useSelector(selectIsLoadingAuth);

    return (
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={ async (values) => {
            // dispatch(fetchCredStart());
            const loginResult = await dispatch(fetchAsyncLogin(values));
            // if (fetchAsyncLogin.fulfilled.match(loginResult)) {
            await dispatch(fetchAsyncGetMyProf());
              // dispatch(fetchCredEnd());
            navigate("/")
            // }
            // dispatch(fetchCredEnd());
            
          }}
          validationSchema={
            Yup.object().shape({
            email: Yup.string()
              .email("有効なメールアドレスではありません。")
              .required("メールアドレスは必須です。"),
            password: Yup.string()
              .required("パスワードは必須です。")
              .min(8, "8文字以上で入力してください。"),
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
                  <h1 className={styles.auth_title}>ログイン</h1>
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

                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}
                  <br />
                  <br />

                  <TextField
                    label="パスワード"
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
                  {/* <br /> */}

                  <div className={styles.auth_button}>
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      ログイン
                    </Button>
                  </div>
                  <br />
                  <p className={styles.auth_text}>
                    <span
                      className={styles.auth_span}
                      onClick={() => {
                        navigate("/auth/register")
                      }}
                    >アカウント登録はこちら
                    </span>
                  </p>
                  <p className={styles.auth_text}>
                    <span
                      className={styles.auth_span}
                      onClick={() => {
                        navigate("/auth/forgot")
                      }}
                    >パスワードを忘れてた方はこちら
                    </span>
                  </p>
                </div>
              </form>
            </div>
          )}
        </Formik>
    )
}

export default Login