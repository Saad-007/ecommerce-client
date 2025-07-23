import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this if your backend is hosted elsewhere
  withCredentials: true, // optional: if you use cookies/auth
});

export const getHeroSlides = async () => {
  const res = await API.get("/hero-slides");
  return res.data.slides;
};

export const createHeroSlide = async (slide) => {
  const res = await API.post("/hero-slides", slide);
  return res.data;
};

export const updateHeroSlide = async (id, slide) => {
  const res = await API.put(`/hero-slides/${id}`, slide);
  return res.data;
};

export const deleteHeroSlide = async (id) => {
  const res = await API.delete(`/hero-slides/${id}`);
  return res.data;
};
