import { JobState } from "@/types/job.types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchJobs, updateJobApproval } from "./jobThunk";

const initialState: JobState = {
  jobs: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch jobs";
      })
      .addCase(updateJobApproval.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateJobApproval.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], ...action.payload };
        }
      })
      .addCase(updateJobApproval.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || "Failed to update job approval";
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
