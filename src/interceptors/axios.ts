import axios from "axios";
const authUrl = process.env.REACT_APP_DEV_API_URL;

axios.defaults.baseURL = `${authUrl}api/v1/`;

axios.defaults.headers.post["Content-Type"] = 'application/json';
axios.defaults.headers.post["Accept"] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;

// cors用
axios.defaults.withCredentials = true;

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 403 && !refresh) {
        refresh = true;

        const response = await axios.post('refresh/', {}, {withCredentials: true});

        if (response.status === 200) {
            localStorage.removeItem("localJWT");
            localStorage.setItem("localJWT", response.data.token);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.localJWT}`;

            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});