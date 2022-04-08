import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../../app/store";
import { PROPS_NEWPOST, PROPS_COMMENT } from "../../types";

export const fetchAsyncGetPosts = createAsyncThunk(
  "posts/get", 
  async () => {
    const res = await axios.get('/post');
    return res.data;
  }
);
export const fetchAsyncGetMorePosts = createAsyncThunk(
  "morePosts/get", 
  async (link: string) => {
    const res = await axios.get(link);
    return res.data;
  }
);
export const fetchAsyncGetPost = createAsyncThunk(
  "postDetail/get", 
  async (id: string | undefined) => {
    const res = await axios.get(`/post/${id}`)
    return res.data;
  }
);
export const fetchAsyncDeletePost = createAsyncThunk(
    "postDelete/delete", 
    async (id: string | undefined) => {
    const  res  = await axios.delete(`/create_update_delete_post/${id}/`);
    return res.data;
  }
);
export const fetchAsyncNewPost = createAsyncThunk(
  "post/post",
  async (newPost: PROPS_NEWPOST) => {
    const uploadData = new FormData();
    uploadData.append("post", newPost.post);
  //   uploadData.append("isPublic", newPost.isPublic);
    const res = await axios.post('/create_update_delete_post/', uploadData);
    return res.data;
  }
);
export const fetchAsyncSharePost = createAsyncThunk(
  "share/post",
  async (postId: string) => {
  //   uploadData.append("isPublic", newPost.isPublic);
    const res = await axios.post(`/post/share/${postId}`, {});
    return res.data;
  }
);
export const fetchAsyncUnsharePost = createAsyncThunk(
  "unshare/post",
  async (postId: string) => {
  //   uploadData.append("isPublic", newPost.isPublic);
    const res = await axios.post(`/post/unshare/${postId}`, {});
    return res.data;
  }
);
export const fetchAsyncGetUserPosts = createAsyncThunk(
  "userPosts/get", 
  async (userId: string | undefined) => {
    const res = await axios.get(`/post/user/${userId}`);
    return res.data;
  }
);
export const fetchAsyncGetSearchedPosts = createAsyncThunk(
  "searchedPosts/get", 
  async (word: string | undefined) => {
    const res = await axios.get(`/post/search/${word}`)
    return res.data;
  }
);
export const fetchAsyncGetHashtagPosts = createAsyncThunk(
  "hashtagPosts/get", 
  async (hashtagId: string | undefined) => {
    const res = await axios.get(`/post/hashtag/${hashtagId}`)
    return res.data;
  }
);
export const fetchAsyncGetFollowingsPosts = createAsyncThunk(
  "followingsPosts/get",
  async (userId: string) => {
    const res = await axios.get(`/followuser/post`);
    return res.data;
  }
);
export const fetchAsyncGetLikedPosts = createAsyncThunk(
  "LikedPosts/get",
  async (userId: string | undefined) => {
    const res = await axios.get(`/post/favorite/${userId}/`);
    return res.data;
  }
);
// export const fetchAsyncUpdatePost = createAsyncThunk(
//   "patch/post",
//   async (post: {id: string | undefined, is_public: boolean}) => {
//     const res = await axios.patch(`/create_update_delete_post/${post.id}`, {is_public: post.is_public});
//     return res.data;
//   }
// )
export const fetchAsyncLikeUnlikePost = createAsyncThunk(
    "like/post",
    async (postId: string) => {
      const res = await axios.post(`/post/like/${postId}/`,{});
      return res.data;
    }
  );
export const fetchAsyncGetComments = createAsyncThunk(
    "comment/get",
    async (postId: string | undefined) => {
      const res = await axios.get(`post/${postId}/comment/`);
      return res.data;
    }
  );
export const fetchAsyncPostComment = createAsyncThunk(
  "comment/post",
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(`/comment/`, comment);
    return res.data;
  }
);
export const fetchAsyncDeleteComment = createAsyncThunk(
  "commentDelete/delete", 
  async (id: string) => {
    const  res  = await axios.delete(`/comment/${id}/`);
    return res.data;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoadingPost: false,
    openPost: false,
    nextPageLink: "",
    posts: [
      {
        id: "",
        post: "",
        postedBy: {id: "", username: ""},
        profile: {nickName: "", img: ""},
        createdAt: "",
        isShared: false,
        isLiked: false,
        countLikes: 0,
        countComments: 0,
        tags: [{
            id: "",
            name: "",
        }], 
        parent: {
          id: "",
          post: "",
          postedBy: {id: "", username: ""},
          profile: {nickName: "", img: ""},
          createdAt: "",
          isShared: false,
          isLiked: false,
          countLikes: 0,
          countComments: 0,
          tags: [{
              id: "",
              name: "",
          }],
        },
      },
    ],
    post: 
    {
        id: "",
        post: "",
        postedBy: {id: "", username: ""},
        profile: {nickName: "", img: ""},
        createdAt: "",
        isShared: false,
        isLiked: false,
        countLikes: 0,
        countComments: 0,
        tags: [{
            id: "",
            name: "",
        }], 
        parent: {
          id: "",
          post: "",
          postedBy: {id: "", username: ""},
          profile: {nickName: "", img: ""},
          createdAt: "",
          isShared: false,
          isLiked: false,
          countLikes: 0,
          countComments: 0,
          tags: [{
              id: "",
              name: "",
          }], 
        },
    },
    comments: [
      {
        id: "",
        comment: "",
        commentedBy: {id: "", username: ""},
        profile: {nickName: "", img: ""},
        commentedAt: "",
        post: "",

      },
    ],
  },
  reducers: {
    setOpenPost(state) {
      state.openPost = true;
    },
    resetOpenPost(state) {
      state.openPost = false;
    },
    resetNextPageLink(state) {
      state.nextPageLink = ""
    },
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    fetchPostDelete(state, action){
      // state.post.countComments -= 1
      state.posts = state.posts.filter((post)=> post.id !== action.payload)
    },
    // fetchChangeLikesOFSharedPost(state, action){

    // },
    fetchPostShare(state, action){
      const unshare = (post:any) => {
        // 投稿のいいね数といいねをしたかどうかを変更
        post.parent.isShared = false;
        return post;
      }
      state.posts = state.posts.map((post) =>
        post.id === action.payload.post ? unshare(post) : post,
      );
    },
    fetchPostUnshare(state, action){
      state.posts = state.posts.filter((post)=> post.id !== action.payload)
      // state.posts = state.posts.map((post) => 
      // {
      //   if(post.id == action.payload){
      //     post.isShared = false
      //   }
      //   return post
      // }
      // )
    },
    fetchCommentDelete(state, action){
      state.post.countComments -= 1
      state.comments = state.comments.filter((comment)=> comment.id !== action.payload)
    },
    fetchUpdateProf(state, action){
        // Profを編集したときに投稿の投稿者名を変更する処理
        state.posts.map((post) => {
            post.profile.nickName = 
              post.postedBy.id === action.payload.postedBy 
                ? action.payload.name 
                : post.postedBy.username
            
            post.profile.img = 
              post.postedBy.id === action.payload.postedBy 
                ? action.payload.img 
                : post.profile.img
        });
      }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetMorePosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: [...state.posts, ...action.payload.results],
      };
    });
    builder.addCase(fetchAsyncGetPost.fulfilled, (state, action) => {
        return {
          ...state,
          post: action.payload,
        };
    });
    builder.addCase(fetchAsyncGetUserPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetSearchedPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetHashtagPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetFollowingsPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncGetLikedPosts.fulfilled, (state, action) => {
      return {
        ...state,
        nextPageLink: action.payload.next,
        posts: action.payload.results,
      };
    });
    builder.addCase(fetchAsyncLikeUnlikePost.fulfilled, (state, action) => {
      if(action.payload.result==='like'){
        // postのstateの変更
        state.post.countLikes += 1
        state.post.isLiked = true
        // postsのstateの変更   
        state.posts = state.posts.map((post) =>
          {
            if(post.parent){
              if(post.parent.id === action.payload.post && post.isShared){
                post.parent.countLikes += 1
                post.parent.isLiked = true;
              }  
            }
            else{
              if(post.id === action.payload.post){
                post.countLikes += 1
                post.isLiked = true;                
              }
            }
            return post
          }
        
        );
      }
      else if(action.payload.result==='unlike'){
        state.post.countLikes -= 1
        state.post.isLiked = false
        // postsのstateの変更
        state.posts = state.posts.map((post) =>
          {
            if(post.parent){
              // シェアされたpostのいいねを変更
              if(post.parent.id === action.payload.post && post.isShared){
                post.parent.countLikes -= 1
                post.parent.isLiked = false;
              }  
            }
            else{
              // postのいいねを変更
              if(post.id === action.payload.post){
                post.countLikes -= 1
                post.isLiked = false;                
              }
            }
            return post
          }
        
        );
      }
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
        return {
          ...state,
          comments: action.payload,
        };
      });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        post: {...state.post, countComments: state.post.countComments+1},
        comments: [action.payload, ...state.comments],
      };
    });

  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  fetchPostShare,
  fetchPostUnshare,
  fetchPostDelete,
  fetchCommentDelete,
  setOpenPost,
  resetOpenPost,
  fetchUpdateProf,
} = postSlice.actions;

export const selectIsLoadingPost = (state: RootState) =>  state.post.isLoadingPost;
export const selectOpenPost = (state: RootState) => state.post.openPost;
export const selectNextPageLink = (state: RootState) => state.post.nextPageLink;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectPost = (state: RootState) => state.post.post;
export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;