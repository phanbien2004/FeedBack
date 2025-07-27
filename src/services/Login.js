import * as request from "../utils/request.js";

export const login = async (username, password) => {
  return await request.post(
    "account/login",
    { username, password },
    {
      withCredentials: true,
    }
  );
};

export const logout = async () => {
  sessionStorage.clear();
  return await request.post(
    "logout",
    {},
    {
      withCredentials: true,
    }
  );
};
