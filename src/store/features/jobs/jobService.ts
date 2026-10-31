import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { Job } from "@/types/job.types";

type JobsPayload = Job[] | { jobs: Job[] };

export const jobService = {
  getAllJobs: async (): Promise<Job[]> => {
    const response =
      await axiosInstance.get<ApiResponse<JobsPayload>>("/admin/getAllJobs");
    const payload = response.data.data;

    return Array.isArray(payload) ? payload : payload.jobs;
  },

  updateJobApproval: async (
    id: string,
    decision: "APPROVE" | "REJECT",
  ): Promise<Job> => {
    const response = await axiosInstance.patch<ApiResponse<Job>>(
      `/admin/jobs/${id}/approval`,
      { decision: decision },
    );

    return response.data.data;
  },
};
