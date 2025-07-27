import axios from "axios";

const request = axios.create({
  baseURL: "http://100.103.11.94:8080/",
  timeout: 10000,
});

export const get = async (api, config = {}) => {
  try {
    const response = await request.get(api, config);
    return response.data;
  } catch (e) {
    console.error("Error get:", e);
  }
};

export const post = async (api, options = {}, config = {}) => {
  try {
    const response = await request.post(api, options, config);
    return response.data;
  } catch (e) {
    console.error("Error post:", e);
  }
};

export const put = async (api, options = {}, config = {}) => {
  try {
    const response = await request.put(api, options, config);
    return response.data;
  } catch (e) {
    console.error("Error put:", e);
  }
};

export const remove = async (api, config = {}) => {
  try {
    const response = await request.delete(api, config);
    return response.data;
  } catch (e) {
    console.error("Error delete:", e);
  }
};
