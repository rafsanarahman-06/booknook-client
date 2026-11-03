"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, LoaderCircle, AlertCircle } from "lucide-react";

const API_URL = "http://localhost:5000";

const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    document.title = "BookNook | All Books";

    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books`);

        if (!response.ok) {
          throw new Error("Could not load books.");
        }

        const data = await response.json();
        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (err) {
        setError("We couldn't load the books. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const title = book.title || "";
    const author = book.author || "";
    const matchesSearch = `${title} ${author}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-[#F8F7F2] py-14">
      <div className="container-width">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[3px] text-[#607D68]">
            Explore Our Collection
          </span>

          <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
            All Books
          </h1>

          <p className="mx-auto max-w-xl leading-7 text-gray-600">
            Find your next favourite story, discover new ideas, and explore
            wonderful books for every reader.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-xl items-center gap-3 rounded-xl border border-[#E4E5DD] bg-white px-4 py-3 shadow-sm">
          <Search size={20} className="shrink-0 text-[#607D68]" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book title or author..."
            className="w-full bg-transparent text-sm text-[#29332D] outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                category === item
                  ? "border-[#607D68] bg-[#607D68] text-white"
                  : "border-[#DDE3D9] bg-white text-[#34483B] hover:border-[#607D68]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4">
            <LoaderCircle className="animate-spin text-[#607D68]" size={38} />
            <p className="text-gray-600">Finding wonderful books for you...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
            <AlertCircle size={38} className="text-red-500" />
            <p className="max-w-md text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#607D68] px-5 py-2.5 text-white hover:bg-[#4E6956]"
            >
              Try Again
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7DF] bg-white px-6 py-16 text-center">
            <BookOpen size={42} className="mx-auto mb-4 text-[#9BAE9D]" />
            <h2 className="mb-2 text-2xl font-semibold">
              {books.length === 0 ? "No Books Yet" : "No Books Found"}
            </h2>
            <p className="text-gray-500">
              {books.length === 0
                ? "Our collection is waiting for its first book."
                : "Try another search or choose a different category."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-500">
              Showing {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
            </p>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <article
                  key={book._id}
                  className="group overflow-hidden rounded-2xl border border-[#EAEAE3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-64 overflow-hidden bg-[#E8EDE5]">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title || "Book cover"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen size={55} className="text-[#9BAE9D]" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="rounded-full bg-[#E8EDE5] px-3 py-1 text-xs font-semibold text-[#4E6956]">
                      {book.category || "Others"}
                    </span>

                    <h2 className="mt-4 line-clamp-1 text-xl font-semibold">
                      {book.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      By {book.author || "Unknown Author"}
                    </p>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#607D68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4E6956]"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}