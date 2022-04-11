import axios from "axios";
import { useParams, useNavigate, Link } from 'react-router-dom';

const authUrl = process.env.REACT_APP_DEV_API_URL;

axios.defaults.baseURL = `${authUrl}api/v1/`;

axios.defaults.headers.post["Content-Type"] = 'application/json';
axios.defaults.headers.post["Accept"] = 'application/json';
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;
axios.defaults.headers.common['X-CSRFToken'] = 'csrftoken';

// cors用
// axios.defaults.withCredentials = true;

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if ((error.response.status === 403 || error.response.status === 401) && !refresh) {
        refresh = true;

        const response = await axios.post('refresh/', {}, {withCredentials: true});

        // if (response.status === 200) {
        if (response.data.token){
            // console.log(localStorage.localJWT)
            localStorage.removeItem("localJWT");
            localStorage.setItem("localJWT", response.data.token);
            
            // console.log(response.data.token)
            // console.log(localStorage.localJWT)

            // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;
            // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            // console.log(error.config)
            error.config.headers.Authorization = `Bearer ${response.data.token}`
            // error.config.headers.Authorization = `Bearer ${localStorage.localJWT}`;

            // console.log(error.config)
            return axios(error.config);
        }
        else{
            let navigate = useNavigate();
            navigate("/auth/login");

        }
        // localStorage.removeItem("localJWT");
        // localStorage.setItem("localJWT", response.data.token);
    }
    refresh = false;
    return error;
});

