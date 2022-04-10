import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../../app/store";
import { 
  PROPS_NEW_ROADMAP, 
  PROPS_UPDATE_ROADMAP, 
  PROPS_NEW_STEP, 
  PROPS_NEW_LOOKBACK, 
  PROPS_CHANGE_STEP_ORDER, 
  PROPS_UPDATE_STEP, 
  PROPS_UPDATE_LOOKBACK 
} from "../../types";

// const apiUrlRoadmap = `/roadmap/`
// const apiUrlFollowRoadmap = `/followuser/roadmap/`;
// const apiUrlStep = `/step/`
// const apiUrlLookback = `/lookback/`

export const fetchAsyncGetRoadmaps = createAsyncThunk("roadmaps/get", async () => {
  const res = await axios.get('/roadmap/');
  return res.data;
});
export const fetchAsyncGetRoadmapsMore = createAsyncThunk("roadmapMore/get", async (link: string) => {
  const res = await axios.get(link);
  return res.data;
});
export const fetchAsyncGetRoadmap = createAsyncThunk("roadmap/get", async (roadmapId: string | undefined) => {
  const res = await axios.get(`/roadmap/${roadmapId}/`);
  return res.data
})
export const fetchAsyncGetOwnRoadmaps = createAsyncThunk("ownroadmaps/get", async (userId: string | undefined) => {
  const res = await axios.get(`/roadmap/user/${userId}/`);
  return res.data;
});
export const fetchAsyncGetFollowUserRoadmap = createAsyncThunk(
  "followuserroadmap/get",
  async () => {
    const res = await axios.get('/followuser/roadmap/', {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.localJWT}`,
    //   },
    });
    return res.data;
});
export const fetchAsyncNewRoadmap = createAsyncThunk(
  "roadmap/post", 
  async (newRoadmap: PROPS_NEW_ROADMAP) => {
    const uploadData = new FormData();
    uploadData.append("title", newRoadmap.title);
    uploadData.append("overview", newRoadmap.overview);
    uploadData.append("isPublic", newRoadmap.isPublic);
    const res = await axios.post(`/roadmap/`, uploadData,);
    return res.data;
});
export const fetchAsyncGetFollowingsRoadmaps = createAsyncThunk(
  "followingsRoadmaps/get",
  async () => {
    const res = await axios.get(`/followuser/roadmap/`);
    return res.data;
  }
);
export const fetchAsyncGetSearchedRoadmap = createAsyncThunk("searchRoadmaps/get", async (word: string) => {
    const res = await axios.get(`/roadmap/search/${word}/`);
    return res.data;
});
export const fetchAsyncUpdateRoadmap = createAsyncThunk(
  "roadmap/patch", 
  async (updateRoadmap: PROPS_UPDATE_ROADMAP) => {
    const uploadData = new FormData();
    uploadData.append("title", updateRoadmap.title);
    uploadData.append("overview", updateRoadmap.overview);
    uploadData.append("isPublic", updateRoadmap.isPublic);
    const res = await axios.patch(`/roadmap/${updateRoadmap.roadmap}/`, uploadData);
    return res.data;
  }
);
export const fetchAsyncDeleteRoadmap = createAsyncThunk("roadmapDelete/delete", async (id: string | undefined) => {
  const  res  = await axios.delete(`/roadmap/${id}/`);
  return res.data;
});
export const fetchAsyncGetSteps = createAsyncThunk("steps/get", async(roadmapId: string | undefined) =>{
  const res = await axios.get(`/step/roadmap/${roadmapId}/`);
  return res.data
})
export const fetchAsyncGetStep = createAsyncThunk("step/get", async(stepId: string) =>{
  const res = await axios.get(`/step/${stepId}/`);
  return res.data
})
export const fetchAsyncNewStep = createAsyncThunk("step/post", async (newStep: PROPS_NEW_STEP) => {
  const uploadData = new FormData();
  uploadData.append("roadmap", newStep.roadmap);
  uploadData.append("toLearn", newStep.toLearn);
  uploadData.append("isCompleted", newStep.isCompleted);
  const res = await axios.post(`/step/`, uploadData);
  return res.data;
});
export const fetchAsyncUpdateStep = createAsyncThunk(
  "step/patch", 
  async (updateStep: PROPS_UPDATE_STEP) => {
    const uploadData = new FormData();
    uploadData.append("toLearn", updateStep.toLearn);
    uploadData.append("isCompleted", updateStep.isCompleted);
    const res = await axios.patch(`/step/${updateStep.step}/`, uploadData);
    return res.data;
  }
);
export const fetchAsyncDeleteStep = createAsyncThunk("stepDelete/delete", async (id: string) => {
  const  res  = await axios.delete(`/step/${id}/`);
  return res.data;
});
export const fetchAsyncChangeStepOrder = createAsyncThunk("editstep/post", async (editStep: PROPS_CHANGE_STEP_ORDER) => {
  const res = await axios.post(`/step/change-order/`, editStep.steps);
  return res.data;
});
export const fetchAsyncGetLookbacks = createAsyncThunk("lookbacks/get", async(stepId: string) =>{
  const res = await axios.get(`/lookback/step/${stepId}/`);
  return res.data
})
export const fetchAsyncNewLookback = createAsyncThunk("lookback/post", async (newLookback: PROPS_NEW_LOOKBACK) => {
  const uploadData = {
    step: newLookback.step,
    learned: newLookback.learned,
  }
  const res = await axios.post(`/lookback/`, uploadData);
  return res.data;
});
export const fetchAsyncUpdateLookback = createAsyncThunk(
  "lookback/patch", 
  async (updateLookback: PROPS_UPDATE_LOOKBACK) => {
    const uploadData = new FormData();
    uploadData.append("learned", updateLookback.learned);
    const res = await axios.patch(`/lookback/${updateLookback.lookback}/`, uploadData);
    return res.data;
  }
);
export const fetchAsyncDeleteLookBack = createAsyncThunk("lookBacktDelete/delete", async (id: string) => {
  const  res  = await axios.delete(`/lookback/${id}/`);
  return res.data;
});

export const roadmapSlice = createSlice({
    name: "roadmap",
    initialState: {
      isLoadingRoadmap: false,
      openRoadmap: false,
      roadmapPagenation: {
          count:0,
          next: "",
          previous: "",
        },
      roadmaps: [
          {
            id: "",
            title: "",
            overview: "",
            challenger: {
                id: "",
                usernmae: ""
            },
            isPublic: "",
            createdAt: "",
            updatedAt: "",
            profile: {
                nickName: "",
                img: "",
            }
          },
      ],
      roadmap: {
          id: "",
          title: "",
          overview: "",
          challenger: {
            id: "",
            usernmae: ""
          },
          isPublic: "",
          createdAt: "",
          updatedAt: "",
          profile: {
            nickName: "",
            img: "",
          }
      },
      steps:[
        {
          id: "",
          roadmap: "",
          challenger: "",
          toLearn: "",
          isCompleted: "",
          order: 0,
          createdAt: "",
          updatedAt: "",
        },
      ], 
      step:{
        id: "",
        roadmap: "",
        challenger: "",
        toLearn: "",
        isCompleted: "",
        order: 0,
        createdAt: "",
        updatedAt: "",
      },
      lookbacks:[
        {
          id: "",
          step: "",
          challenger: "",
          learned: "",
          createdAt: "",
          updatedAt: "",
        }
      ]
    },
    reducers:{
      setOpenRoadmap(state) {
        state.openRoadmap = true;
      },
      resetOpenRoadmap(state) {
        state.openRoadmap = false;
      },
      fetchPostStart(state) {
          state.isLoadingRoadmap = true;
      },
      fetchPostEnd(state) {
          state.isLoadingRoadmap = false;
      },
      fetchChangeStepOrder(state, action) {
        const index = action.payload;
        if (index !== 0 && index <= state.steps.length-1){
            // 分割代入(orderを入れ替え)
            [state.steps[index].order, state.steps[index-1].order] = [state.steps[index-1].order, state.steps[index].order];
            // stepsをorderが小さい順に
            state.steps.sort((a, b) => {
                return a.order - b.order;
            });
        }
      },
      fetchRoadmapDelete(state, action){
        state.roadmaps = state.roadmaps.filter((roadmap)=> roadmap.id !== action.payload)
      },
      fetchStepDelete(state, action){
        state.steps = state.steps.filter((step)=> step.id !== action.payload)
      },
      fetchLookBackDelete(state, action){
        state.lookbacks = state.lookbacks.filter((lookback)=> lookback.id !== action.payload)
      }, 
    },
    extraReducers: (builder) => {
      builder.addCase(fetchAsyncGetRoadmaps.fulfilled, (state, action) => {
        return {
          ...state,
          roadmapPagenation:{
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          },
          roadmaps: action.payload.results,
        };
      });
      builder.addCase(fetchAsyncGetRoadmapsMore.fulfilled, (state, action) => {
        return {
          ...state,
          roadmapPagenation:{
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          },
          roadmaps: action.payload.results,
        };
      });
      builder.addCase(fetchAsyncGetRoadmap.fulfilled, (state, action) => {
        return {
          ...state,
          roadmap: action.payload,
        };
      });
      builder.addCase(fetchAsyncGetFollowUserRoadmap.fulfilled, (state, action) => {
        return {
          ...state,
          roadmapPagenation:{
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          },
          roadmaps: action.payload.results,
        };
      });
      builder.addCase(fetchAsyncGetOwnRoadmaps.fulfilled, (state, action) => {
        return {
          ...state,
          roadmapPagenation:{
            count: action.payload.count,
            next: action.payload.next,
            previous: action.payload.previous,
          },
          roadmaps: action.payload.results,
        };
      });
      builder.addCase(fetchAsyncGetSearchedRoadmap.fulfilled, (state, action) => {
        return {
            ...state,
            roadmapPagenation:{
              count: action.payload.count,
              next: action.payload.next,
              previous: action.payload.previous,
            },
            roadmaps: action.payload.results,
          };
      });
      builder.addCase(fetchAsyncGetFollowingsRoadmaps.fulfilled, (state, action) => {
        return {
            ...state,
            roadmapPagenation:{
              count: action.payload.count,
              next: action.payload.next,
              previous: action.payload.previous,
            },
            roadmaps: action.payload.results,
          };
      });
      builder.addCase(fetchAsyncNewRoadmap.fulfilled, (state, action) => {
        return {
          ...state,
          roadmaps: [...state.roadmaps, action.payload],
        };
      });
      builder.addCase(fetchAsyncUpdateRoadmap.fulfilled, (state, action) => {
        state.roadmaps = state.roadmaps.map((roadmap) =>
          roadmap.id === action.payload.id ? action.payload : roadmap
        );
      });
      builder.addCase(fetchAsyncGetSteps.fulfilled, (state, action) => {
        return {
          ...state,
          steps: action.payload,
        };
      });
      builder.addCase(fetchAsyncGetStep.fulfilled, (state, action) => {
        return {
          ...state,
          step: action.payload,
        };
      });
      builder.addCase(fetchAsyncNewStep.fulfilled, (state, action) => {
        return {
          ...state,
          steps: [...state.steps, action.payload],
        };
      });
      builder.addCase(fetchAsyncUpdateStep.fulfilled, (state, action) => {
        state.steps = state.steps.map((step) =>
          step.id === action.payload.id ? action.payload : step
        );
      });
      builder.addCase(fetchAsyncGetLookbacks.fulfilled, (state, action) => {
        return {
          ...state,
          lookbacks: action.payload,
        };
      });
      builder.addCase(fetchAsyncNewLookback.fulfilled, (state, action) => {
        return {
          ...state,
          lookbacks: [...state.lookbacks, action.payload],
        };
      });
      builder.addCase(fetchAsyncUpdateLookback.fulfilled, (state, action) => {
        state.lookbacks = state.lookbacks.map((lookback) =>
          lookback.id === action.payload.id ? action.payload : lookback
        );
      });
    }
});

export const {
  setOpenRoadmap,
  resetOpenRoadmap,
  fetchPostEnd,
  fetchPostStart,
  fetchChangeStepOrder,
  fetchRoadmapDelete,
  fetchStepDelete,
  fetchLookBackDelete,
} = roadmapSlice.actions;

export const selectIsLoadingRoadmap = (state: RootState) =>  state.roadmap.isLoadingRoadmap;
export const selectOpenRoadmap = (state: RootState) => state.roadmap.openRoadmap;
export const selectRoadmapPagenation = (state: RootState) => state.roadmap.roadmapPagenation;
export const selectRoadmaps = (state: RootState) => state.roadmap.roadmaps;
export const selectRoadmap = (state: RootState) => state.roadmap.roadmap;
export const selectSteps = (state: RootState) => state.roadmap.steps;
export const selectStep = (state: RootState) => state.roadmap.step;
export const selectLookbacks = (state: RootState) => state.roadmap.lookbacks;

export default roadmapSlice.reducer;