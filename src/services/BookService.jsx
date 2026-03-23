import axios from "axios";

const BASE_URL = "http://localhost:8080/books";

export const getBooks = () => axios.get(BASE_URL);
export const addBook = (book) => axios.post(BASE_URL, book);
export const getBookById = (id) => axios.get(`${BASE_URL}/${id}`);
export const updateBook = (id, book) => axios.put(`${BASE_URL}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${BASE_URL}/${id}`);