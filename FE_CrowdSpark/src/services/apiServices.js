import axios from "../util/axios.customize";

export const loginFunction = async (payload) => {
  try {
    const res = await axios.post("/api/auth/login", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const signupFunction = async (payload) => {
  try {
    const res = await axios.post("/api/auth/signup", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const logoutFunction = async () => {
  try {
    const res = await axios.post("/api/auth/logout");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
