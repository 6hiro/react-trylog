import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Settings from "../pages/Auth/Settings";
import Profiles from "../components/profile/Profiles";
import Profile from "../pages/Profile/Profile"

import PostList from "../pages/Post/PostList";
import AddPost from "../pages/Post/AddPost";
import PostDetail from "../pages/Post/PostDetail";
import PostHashtag from "../pages/Post/PostHashtag";
import PostSearch from "../pages/Post/PostSearch";

import Roadmap from "../pages/Roadmap/Roadmap";
import FollowingRoadmap from "../pages/Roadmap/FollowingRoadmap";
import RoadmapSearch from "../pages/Roadmap/RoadmapSearch";
import AddRoadmap from "../pages/Roadmap/AddRoadmap";
import Step from "../pages/Roadmap/Step";

import styles from "../components/layout/Layout.module.css"
import ScrollToTop from "./ScrollToTop ";
import Lookback from "../pages/Roadmap/Lookback";


const Core: React.FC = () => {
  
  return (
    <div>

      <BrowserRouter>
        {/* Layout */}
        <Layout />
        {/* いいねした人やfollower、followeeの一覧 */}
        <Profiles />
        
        {/* ページ遷移時にスクロール位置をトップに */}
        <ScrollToTop /> 
        
        <main className={styles.main}>
          <section>
            <Routes>
              {/* Auth */}
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/forgot" element={<ForgotPassword />}/>
              <Route path="/auth/reset-password/:token" element={<ResetPassword />}/>
              <Route path="/settings" element={<Settings />} />

              {/* Profile */}
              <Route path="/prof/:id" element={<Profile />} />

              {/* Post */}
              <Route path="/" element={<Home />} />
              <Route path="/post/add" element={<AddPost />} />
              <Route path="/post/list" element={<PostList />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/hashtag/:id" element={<PostHashtag />} />
              <Route path="/search/:word/" element={<PostSearch />} />

              {/* Roadmap */}
              <Route path="/roadmap/user/:id" element={<Roadmap />} />
              <Route path="/roadmap" element={<FollowingRoadmap />} /> 
              <Route path="/roadmap/search/:word/" element={<RoadmapSearch />} /> 
              <Route path="/roadmap/add" element={<AddRoadmap />} />
              <Route path="/step/roadmap/:id" element={<Step />} />
              <Route path="/lookback/step/:id" element={<Lookback />} />
            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default Core;