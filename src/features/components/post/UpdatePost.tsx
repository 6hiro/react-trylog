import React from 'react';
import { useNavigate, useParams } from "react-router-dom";

import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';

import { AppDispatch } from "../../../app/store";
import {
//   fetchAsyncUpdatePost,
  selectIsLoadingPost,
  fetchPostStart,
  fetchPostEnd,
  selectOpenPost,
  resetOpenPost,
} from "../../pages/Post/postSlice";

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
        height: 320,
        padding: "40px",
        transform: "translate(-50%, -50%)",
    },
};
const UpdatePost: React.FC<{ postId: string; isPublic: boolean;}> = (props) => {
    Modal.setAppElement("#app");
    let navigate = useNavigate();

    const isOpenUpdateModal = useSelector(selectOpenPost);

    const isLoadingPost = useSelector(selectIsLoadingPost);
    const dispatch: AppDispatch = useDispatch();
    const { id } = useParams();
    
    const postUpdate = (isPublic: string) => {
        const packet =  { 
            id: id, 
            is_public: isPublic==='public' ? true : false,
          };
        // dispatch(fetchAsyncUpdatePost(packet))
      }
    return (
        <div>
            <Modal
                isOpen={isOpenUpdateModal}
                onRequestClose={async () => {
                    await dispatch(resetOpenPost());
                }}
                style={customStyles}
            >
             <Formik
                initialErrors={{ isPublic: "required" }}

                initialValues={{
                    // post: "",
                    id: props.postId,
                    isPublic: props.isPublic ? "public" : "private",
                }}
                
                onSubmit={ async(values) => {
                    dispatch(fetchPostStart());
                    await postUpdate(values.isPublic)
                    dispatch(fetchPostEnd());
                    dispatch(resetOpenPost())
                }}
                validationSchema={
                    Yup.object().shape({
                    isPublic: Yup.string()
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
                    <div className="update_post">
                        <div className="update_post_title">公開・非公開</div>
                        <div className="update_post_progress">
                                {isLoadingPost && <CircularProgress />}
                        </div>
                        <form className="update_post_form" onSubmit={handleSubmit}>
                            <div className="update_post_button">
                                <FormControl>
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
                                    <option value={"public"}>公開</option>
                                    <option value={"private"}>非公開</option>
                                </Select>
                                </FormControl>
                                {touched.isPublic && errors.isPublic ? (
                                    <div className="post_error">{errors.isPublic}</div>
                                ) : null}
                                <br />
                                <Button
                                   // variant="contained"
                                    variant="outlined"
                                    color="primary"
                                    disabled={!isValid}
                                    type="submit"
                                >
                                    変更
                                </Button >                    
                            </div>
                        </form>
                    </div>
                )}
                </Formik>
            </Modal>
            
        </div>
    )
}

export default UpdatePost