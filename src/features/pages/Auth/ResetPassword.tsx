import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
//   fetchAsyncRegister,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncResetPassword,
} from "./authSlice";
import styles from "./Auth.module.css";

const ResetPassword: React.FC = () => {
    let navigate = useNavigate();
    const { token } = useParams();

    const dispatch: AppDispatch = useDispatch();
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
  return (
    <Formik
      initialErrors={{ password: "required" }}
      initialValues={{ password: "", confirmPassword: "" }}
      onSubmit={async (values) => {
        dispatch(fetchCredStart());
        const registrationResult = await dispatch(
            fetchAsyncResetPassword({
              password:values.password, 
              passwordConfirm:values.confirmPassword,
              token: String(token)
            })
        );

        if (fetchAsyncResetPassword.fulfilled.match(registrationResult)) {
          // await dispatch(fetchAsyncGetMyProf());
          dispatch(fetchCredEnd());
          navigate("/auth/login")
        }else{
          dispatch(fetchCredEnd());
        }
      }}
      validationSchema={Yup.object().shape({
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
              <h1 className={styles.auth_title}>パスワードをリセット</h1>
              <div className={styles.auth_progress}>
                {isLoadingAuth && <CircularProgress />}
              </div>
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
                  パスワードを送信
                </Button>
              </div>
              <br />

            </div>
          </form>
        </div>
      )}
    </Formik>
  )
}

export default ResetPassword