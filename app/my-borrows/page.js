"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookOpen, CalendarDays, LoaderCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function MyBorrowsContent() {
  const { data: session } = useSession();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  async function fetchBorrows() {
    try {
      const response = await axios.get(`${API_URL}/borrows`, {
        params: { email: session.user.email },
      });

      setBorrows(response.data);
    } catch (error) {
      toast.error("Failed to load borrowed books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchBorrows();
    }
  }, [session?.user?.email]);

  async function handleReturn(id) {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) return;

    setReturningId(id);

    try {
      await axios.delete(`${API_URL}/borrows/${id}`, {
        params: { email: session.user.email },
      });

      setBorrows((previous) =>
        previous.filter((borrow) => borrow._id !== id)
      );

      toast.success("Book returned successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to return book."
      );
    } finally {
      setReturningId(null);
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
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#607D68]">
            Your Reading Journey
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#29332D] md:text-4xl">
            My Borrowed Books
          </h1>

          <p className="mt-3 text-[#59665D]">
            Keep track of the books you have borrowed from our library.
          </p>
        </div>

        {borrows.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen
              size={48}
              className="mx-auto mb-4 text-[#607D68]"
            />

            <h2 className="font-serif text-2xl font-semibold text-[#29332D]">
              No Borrowed Books Yet
            </h2>

            <p className="mt-3 text-[#59665D]">
              Discover a wonderful book and start reading today.
            </p>

            <a
              href="/books"
              className="mt-6 inline-block rounded-lg bg-[#607D68] px-6 py-3 font-medium text-white hover:bg-[#4D6955]"
            >
              Browse Books
            </a>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-[#E8EDE5] text-sm text-[#29332D]">
                  <tr>
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Borrow Date</th>
                    <th className="px-6 py-4">Return Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {borrows.map((borrow) => (
                    <tr
                      key={borrow._id}
                      className="border-b border-[#E8EDE5] last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            className="h-16 w-12 rounded-md object-cover"
                          />

                          <span className="font-semibold text-[#29332D]">
                            {borrow.bookTitle}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#59665D]">
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#59665D]">
                        {new Date(borrow.returnDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleReturn(borrow._id)}
                          disabled={returningId === borrow._id}
                          className="flex items-center gap-2 rounded-lg bg-[#E8EDE5] px-4 py-2 text-sm font-medium text-[#607D68] hover:bg-[#DCE5D9] disabled:opacity-50"
                        >
                          {returningId === borrow._id ? (
                            <LoaderCircle
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <RotateCcw size={16} />
                          )}

                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function MyBorrowsPage() {
  return (
    <ProtectedRoute>
      <MyBorrowsContent />
    </ProtectedRoute>
  );
}