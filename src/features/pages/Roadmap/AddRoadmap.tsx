import React from 'react'
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { 
    TextField, 
    Button, 
    CircularProgress,
    FormControl, 
    Select 
} from "@mui/material";

import { AppDispatch } from "../../../app/store";
import { 
    selectIsLoadingRoadmap,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncNewRoadmap,
} from './roadmapSlice';
import { 
  fetchAsyncRefreshToken,
  selectMyProfile,
//   fetchAsyncRefreshToken,
//   setOpenLogIn
} from '../Auth/authSlice';
import styles from "./AddRoadmap.module.css";

const AddRoadmap: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);
    const profile = useSelector(selectMyProfile);

    return (
        <div>
        <Formik
          initialErrors={{ title: "required" }}

          initialValues={{
            title: "",
            overview: "",
            isPublic: "private",
          }}
          onSubmit={async (values) => {
            dispatch(fetchPostStart());
            const result = await dispatch(fetchAsyncNewRoadmap(values));
            if (fetchAsyncNewRoadmap.rejected.match(result)) {
              await dispatch(fetchAsyncRefreshToken())
              const retryResult = await dispatch(fetchAsyncNewRoadmap(values));
              if (fetchAsyncNewRoadmap.rejected.match(retryResult)) {
                dispatch(fetchPostEnd());
                navigate(`/auth/login`);
              }else if (fetchAsyncNewRoadmap.fulfilled.match(retryResult)) {
                dispatch(fetchPostEnd());
                navigate(`/roadmap/user/${profile.user.id}`);
              }
            }else if (fetchAsyncNewRoadmap.fulfilled.match(result)) {
              dispatch(fetchPostEnd());
              navigate(`/roadmap/user/${profile.user.id}`);
            }
          }}
          validationSchema={
            Yup.object().shape({
              title: Yup.string()
                .required("??????????????????????????????")
                .max(60, "60??????????????????????????????????????????"),
              overview: Yup.string()
                // .required("??????????????????????????????")
                .max(250, "250??????????????????????????????????????????"),
              isPublic: Yup.string()
                .required("??????????????????????????????"),
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
            <div className={styles.add_roadmap}>
              <h1 className={styles.title}>??????</h1>
              <div className={styles.postProgress}>
                    {isLoadingRoadmap && <CircularProgress />}
              </div>
              <form className={styles.add_post} onSubmit={handleSubmit}>
                <div>
                  <TextField
                    // id="standard-basic" 
                    id="outlined-textarea"
                    label="????????????"
                    // style={{ marginTop: 10 }}
                    fullWidth
                    // multiline
                    variant="outlined"
                    type="input"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  {touched.title && errors.title ? (
                    <div className={styles.post_error}>{errors.title}</div>
                  ) : null}
                  <br />

                  <TextField
                    // id="standard-basic" 
                    id="outlined-textarea"
                    label="??????"
                    style={{ marginTop: 30 }}
                    fullWidth
                    multiline
                    variant="outlined"
                    type="input"
                    name="overview"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.overview}
                  />
                  {touched.overview && errors.overview ? (
                    <div className={styles.post_error}>{errors.overview}</div>
                  ) : null}
                  {/* <br /> */}
                  
                  <div className={styles.post_button}>
                    <FormControl>
                      <Select
                        native
                        style={{ marginTop: 30 }}
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
                      <div className={styles.post_error}>{errors.isPublic}</div>
                    ) : null}
                    <br />
                    <br />
                    <div className={styles.notes}>
                      <p>?????????????????????????????????????????????60??????</p>
                      <p>?????????250????????????</p>
                      <p>?????????????????????????????????</p>
                    </div>
                    <Button
                    //   variant="contained"
                      variant="outlined"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      ??????  
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

export default AddRoadmap