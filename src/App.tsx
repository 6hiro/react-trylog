import React from 'react';
import ReactDOM from 'react-dom';
import Core from './features/core/Core';
import axios from 'axios';

// axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.post["Content-Type"] = 'application/json';
axios.defaults.headers.post["Accept"] = 'application/json';
// cors用
// axios.defaults.withCredentials = true;

const App: React.FC = () => {
    return (
        <div className="App">
             <Core />
        </div>     
    )
}

export default App;