import React from 'react'
import { useNavigate } from 'react-router-dom';
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
    fetchAsyncNewStep,
} from '../../pages/Roadmap/roadmapSlice';
import { fetchAsyncRefreshToken } from '../../pages/Auth/authSlice';
import styles from "./AddStep.module.css";


const AddStep: React.FC<{ roadmapId: string; }> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    let navigate = useNavigate();
    const isLoadingRoadmap = useSelector(selectIsLoadingRoadmap);

    return (
        <div>
          <Formik
            initialErrors={{ toLearn: "required" }}
            initialValues={{
                roadmap: props.roadmapId,
                toLearn: "",
                isCompleted: "left_untouched",
            }}
            onSubmit={async (values, {resetForm}) => {
                dispatch(fetchPostStart());
                const result = await dispatch(fetchAsyncNewStep(values));
                if(fetchAsyncNewStep.rejected.match(result)){
                    await dispatch(fetchAsyncRefreshToken())
                    const retryreysult = await dispatch(fetchAsyncNewStep(values));
                    if(fetchAsyncNewStep.rejected.match(retryreysult)){
                        navigate("/auth/login");
                    }else if (fetchAsyncNewStep.fulfilled.match(retryreysult)){
                        dispatch(fetchPostEnd());
                        resetForm();
                    }

                }else if (fetchAsyncNewStep.fulfilled.match(result)){
                    dispatch(fetchPostEnd());
                    resetForm()
                }
            }}
            validationSchema={
                Yup.object().shape({
                toLearn: Yup.string()
                    .required("この項目は必須です。")
                    .max(60, "60文字以内で入力してください。"),
                isCompleted: Yup.string()
                    .required("この項目は必須です。"),
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
                <div className={styles.add_step}>
                    <div className={styles.postProgress}>
                        {isLoadingRoadmap && <CircularProgress />}
                    </div>

                    <form className={styles.add_step_form} onSubmit={handleSubmit}>
                        <div>
                        <TextField
                            // id="standard-basic" 
                            id="outlined-textarea"
                            label="ステップ"
                            // style={{ marginTop: 10 }}
                            fullWidth
                            multiline
                            variant="outlined"
                            type="input"
                            name="toLearn"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.toLearn}
                        />
                        {touched.toLearn && errors.toLearn ? (
                            <div className={styles.post_error}>{errors.toLearn}</div>
                        ) : null}
                        <br />
                        
                        <div className={styles.post_button}>
                            <FormControl>
                                <Select
                                    native
                                    style={{ margin: 10 }}
                                    value={values.isCompleted}
                                    onChange={handleChange}
                                    inputProps={{
                                    name: 'isCompleted',
                                    id: 'age-native-simple',
                                    }}
                                >
                                    <option value={"left_untouched"}>未着手</option>
                                    <option value={"going"}>取組中</option>
                                    <option value={"is_completed"}>完了</option>
                                </Select>
                            </FormControl>
                            {touched.isCompleted && errors.isCompleted ? (
                            <div className={styles.post_error}>{errors.isCompleted}</div>
                            ) : null}
    
                            <br />
                            <div className={styles.notes}>
                                <p>入力できる文字数は、60字です。</p>
                            </div>
                            <br />

                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={!isValid}
                                type="submit"
                            >
                            追加
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

export default AddStep