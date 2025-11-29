import axios from "../util/axios.customize";
import { io } from "socket.io-client";

export const loginFunction = async (payload) => {
  try {
    const res = await axios.post("/auth/login", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const signupFunction = async (payload) => {
  try {
    const res = await axios.post("/auth/signup", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const logoutFunction = async () => {
  try {
    const res = await axios.post("/auth/logout");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllQuestions = async () => {
  try {
    const res = await axios.get("/rooms/my-rooms");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addQuestionFunction = async (payload) => {
  try {
    const res = await axios.post("/rooms/create", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const answerQuestion = async (payload) => {
  try {
    const res = await axios.post("/rooms/answer", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAnswer = async (id) => {
  try {
    const res = await axios.post(`/rooms/${id}/summarize`);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};
