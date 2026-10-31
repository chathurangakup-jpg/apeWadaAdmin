import { RootState } from "@/store";

export const selectJobs = (state: RootState) => state.jobs.jobs;
export const selectJobsLoading = (state: RootState) => state.jobs.isLoading;
export const selectJobsUpdating = (state: RootState) => state.jobs.isUpdating;
export const selectJobsError = (state: RootState) => state.jobs.error;
