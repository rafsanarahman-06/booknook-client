"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  BookOpen,
  LoaderCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

function MyBooksContent() {
  const { data: session } = useSession();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
  });

  async function fetchMyBooks() {
    try {
      const response = await axios.get(`${API_URL}/books`);

      const allBooks = Array.isArray(response.data)
        ? response.data
        : [];

      const myBooks = allBooks.filter(
        (book) =>
          book.addedByEmail?.toLowerCase() ===
          session.user.email.toLowerCase()
      );

      setBooks(myBooks);
    } catch (error) {
      toast.error("Failed to load your books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBooks();
    }
  }, [session?.user?.email]);

  function openEditModal(book) {
    setEditingBook(book);

    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "Fiction",
      image: book.image || "",
      description: book.description || "",
    });
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleUpdate(event) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.image.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please complete all fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await axios.patch(
        `${API_URL}/books/${editingBook._id}`,
        form
      );

      const updatedBook = response.data.book || {
        ...editingBook,
        ...form,
      };

      setBooks((previous) =>
        previous.map((book) =>
          book._id === editingBook._id
            ? updatedBook
            : book
        )
      );

      setEditingBook(null);

      toast.success("Book updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update book."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!bookToDelete) return;

    const id = bookToDelete._id;

    setDeletingId(id);

    try {
      await axios.delete(`${API_URL}/books/${id}`);

      setBooks((previous) =>
        previous.filter((book) => book._id !== id)
      );

      setBookToDelete(null);

      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete book."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F7F2]">
        <LoaderCircle
          size={36}
          className="animate-spin text-[#607D68]"
        />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#607D68]">
            Your Collection
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#29332D] md:text-4xl">
            My Books
          </h1>

          <p className="mt-3 text-[#59665D]">
            Manage the books you have added to BookNook.
          </p>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen
              size={48}
              className="mx-auto mb-4 text-[#607D68]"
            />

            <h2 className="font-serif text-2xl font-semibold text-[#29332D]">
              No Books Added Yet
            </h2>

            <p className="mt-3 text-[#59665D]">
              Start building your collection by adding your first book.
            </p>

            <a
              href="/add-book"
              className="mt-6 inline-block rounded-lg bg-[#607D68] px-6 py-3 font-medium text-white hover:bg-[#4D6955]"
            >
              Add a Book
            </a>
          </div>
        ) : (

          /* Book Cards */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-60 items-center justify-center bg-[#F1F2EC] p-5">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-[#E8EDE5] px-3 py-1 text-xs font-medium text-[#607D68]">
                    {book.category}
                  </span>

                  <h2 className="mt-4 font-serif text-xl font-bold text-[#29332D]">
                    {book.title}
                  </h2>

                  <p className="mt-2 text-sm text-[#59665D]">
                    By {book.author}
                  </p>

                  <div className="mt-5 flex gap-3">

                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(book)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#607D68] px-3 py-2.5 text-sm font-medium text-[#607D68] hover:bg-[#E8EDE5]"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setBookToDelete(book)}
                      disabled={deletingId === book._id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#29332D]">
                Edit Book
              </h2>

              <button
                onClick={() => setEditingBook(null)}
                disabled={saving}
                aria-label="Close edit form"
                className="text-[#59665D] hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-[#29332D]">
                  Book Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#D9DED6] px-4 py-3 outline-none focus:border-[#607D68]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#29332D]">
                  Author
                </label>

                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#D9DED6] px-4 py-3 outline-none focus:border-[#607D68]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#29332D]">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#D9DED6] px-4 py-3 outline-none focus:border-[#607D68]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#29332D]">
                  Book Image URL
                </label>

                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#D9DED6] px-4 py-3 outline-none focus:border-[#607D68]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#29332D]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full resize-y rounded-lg border border-[#D9DED6] px-4 py-3 outline-none focus:border-[#607D68]"
                />
              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-[#D9DED6] px-4 py-3 font-medium text-[#59665D]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#607D68] px-4 py-3 font-semibold text-white hover:bg-[#4D6955] disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={26} className="text-red-500" />
            </div>

            <h2 className="text-center font-serif text-2xl font-bold text-[#29332D]">
              Delete This Book?
            </h2>

            <p className="mt-3 text-center leading-7 text-[#59665D]">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-[#29332D]">
                {bookToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">

              <button
                onClick={() => setBookToDelete(null)}
                disabled={deletingId !== null}
                className="flex-1 rounded-lg border border-[#D9DED6] px-4 py-3 font-medium text-[#59665D] hover:bg-[#F8F7F2] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deletingId ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={18} />
                )}

                {deletingId ? "Deleting..." : "Delete"}
              </button>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default function MyBooksPage() {
  return (
    <ProtectedRoute>
      <MyBooksContent />
    </ProtectedRoute>
  );
}