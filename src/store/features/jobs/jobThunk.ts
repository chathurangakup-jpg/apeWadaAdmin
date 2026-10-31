import { Job } from "@/types/job.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jobService } from "./jobService";

export const fetchJobs = createAsyncThunk<Job[], void, { rejectValue: string }>(
  "jobs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await jobService.getAllJobs();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch jobs",
        );
      }

      return rejectWithValue("An unexpected error occurred");
    }
  },
);

export const updateJobApproval = createAsyncThunk<
  Job,
  { id: string; decision: "APPROVE" | "REJECT" },
  { rejectValue: string }
>("jobs/updateApproval", async ({ id, decision }, { rejectWithValue }) => {
  try {
    return await jobService.updateJobApproval(id, decision);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job approval",
      );
    }

    return rejectWithValue("An unexpected error occurred");
  }
});
