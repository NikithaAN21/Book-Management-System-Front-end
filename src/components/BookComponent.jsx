import { useEffect, useState } from "react";
import {
  getBooks,
  addBook,
  deleteBook,
  getBookById,
  updateBook,
} from "../services/BookService";

import "../Book.css";

export default function BookComponent() {
  const [books, setBooks] = useState([]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    author: "",
    description: "",
    price: "",
  });

  // ✅ separate state for view modal
  const [viewBook, setViewBook] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const res = await getBooks();
    setBooks(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD + UPDATE
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateBook(form.id, {
          ...form,
          price: parseFloat(form.price),
        });
        setIsEditing(false);
      } else {
        await addBook({
          ...form,
          price: parseFloat(form.price),
        });
      }

      // reset form
      setForm({
        id: null,
        title: "",
        author: "",
        description: "",
        price: "",
      });

      loadBooks();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    loadBooks();
  };

  // ✅ VIEW (uses separate state)
  const handleView = async (id) => {
    const res = await getBookById(id);
    setViewBook(res.data);
  };

  // ✅ EDIT (no modal interference)
  const handleEdit = (book) => {
    setForm({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
    });
    setIsEditing(true);
  };

  return (
    <div className="container">
      <h2>Book Management System</h2>

      {/* FORM */}
      <div className="form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />

        <button onClick={handleSubmit}>
          {isEditing ? "Update Book" : "Add Book"}
        </button>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>
                <button onClick={() => handleView(b.id)}>View</button>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ MODAL (separate state) */}
      {viewBook && (
        <div className="modal">
          <div className="modal-content">
            <h3>Book Details</h3>
            <p><b>Title:</b> {viewBook.title}</p>
            <p><b>Author:</b> {viewBook.author}</p>
            <p><b>Description:</b> {viewBook.description}</p>
            <p><b>Price:</b> {viewBook.price}</p>

            <button onClick={() => setViewBook(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}