import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
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
