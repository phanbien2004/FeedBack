import * as request from "../utils/request.js";

export const sendFeedBack = async (accountId, content, type, category) => {
  return await request.post(
    `feedback/send/${accountId}`,
    { content, type, category },
    {
      withCredentials: true,
    }
  );
};

export const studentGetFeedBack = async (
  accountId,
  type,
  category,
  sortCriteria,
  status
) => {
  return await request.get(`feedback/student/${accountId}`, {
    params: {
      type,
      category,
      sortCriteria,
      status,
    },
  });
};

export const departmentGetFeedBack = async (category, sortCriteria, status) => {
  return await request.get(`feedback/department`, {
    params: {
      category,
      sortCriteria,
      status,
    },
  });
};

export const responseFeedBack = async (feedbackId, content) => {
  return await request.put("feedback/response", { feedbackId, content }, {});
};

export const managementGetFeedBack = async (
  type,
  category,
  sortCriteria,
  status
) => {
  return await request.get(`feedback/executive`, {
    params: {
      type,
      category,
      sortCriteria,
      status,
    },
  });
};
