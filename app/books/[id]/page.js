"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, BookOpen, CalendarDays, LoaderCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import ProtectedRoute from "@/components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function BookDetailsContent() {
const { id } = useParams();
const router = useRouter();
const { data: session } = useSession();

const [book, setBook] = useState(null);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [borrowing, setBorrowing] = useState(false);

useEffect(() => {
async function fetchBook() {
try {
const response = await axios.get(`${API_URL}/books/${id}`);
setBook(response.data);
} catch (error) {
toast.error("Could not load book details.");
} finally {
setLoading(false);
}
}

if (id) fetchBook();

}, [id]);

const handleBorrow = async () => {
if (!session?.user?.email || !book) {
toast.error("Please log in to borrow this book.");
return;
}

setBorrowing(true);

try {
  const borrowDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14);

  await axios.post(`${API_URL}/borrows`, {
    bookId: book._id,
    bookTitle: book.title,
    bookImage: book.image,
    userEmail: session.user.email,
    borrowDate: borrowDate.toISOString(),
    returnDate: returnDate.toISOString(),
  });

  toast.success("Book borrowed successfully!");
  setShowModal(false);
  router.push("/my-borrows");
} catch (error) {
  toast.error(
    error.response?.data?.message || "Failed to borrow this book."
  );
} finally {
  setBorrowing(false);
}

};

if (loading) {
return ( <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F7F2]"> <LoaderCircle className="animate-spin text-[#607D68]" size={36} /> </div>
);
}

if (!book) {
return ( <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F8F7F2] px-4"> <BookOpen size={48} className="mb-4 text-[#607D68]" /> <h2 className="text-2xl font-semibold text-[#29332D]">
Book Not Found </h2>
<button
onClick={() => router.push("/books")}
className="mt-5 rounded-lg bg-[#607D68] px-6 py-3 text-white"
>
Browse Books </button> </div>
);
}

return ( <section className="min-h-screen bg-[#F8F7F2] px-4 py-12"> <div className="mx-auto max-w-5xl">
<button
onClick={() => router.back()}
className="mb-8 flex items-center gap-2 text-sm font-medium text-[#607D68] hover:underline"
> <ArrowLeft size={18} />
Back to Books </button>

    <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
      <div className="flex min-h-[350px] items-center justify-center rounded-xl bg-[#F1F2EC] p-5">
        <img
          src={book.image}
          alt={book.title}
          className="max-h-[420px] w-full object-contain"
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className="mb-4 w-fit rounded-full bg-[#E8EDE5] px-4 py-2 text-sm font-medium text-[#607D68]">
          {book.category}
        </span>

        <h1 className="font-serif text-3xl font-bold leading-tight text-[#29332D] md:text-4xl">
          {book.title}
        </h1>

        <p className="mt-4 text-lg text-[#59665D]">
          By {book.author}
        </p>

        <div className="my-7 h-px bg-[#E8EDE5]" />

        <h2 className="mb-3 text-lg font-semibold text-[#29332D]">
          About This Book
        </h2>

        <p className="leading-8 text-[#59665D]">
          {book.description || "No description available for this book."}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm text-[#59665D]">
          <CalendarDays size={18} />
          Added to the library
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-8 rounded-lg bg-[#607D68] px-6 py-4 font-semibold text-white transition hover:bg-[#4D6955]"
        >
          Borrow This Book
        </button>
      </div>
    </div>
  </div>

  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#29332D]">
            Confirm Borrowing
          </h2>
          <button
            onClick={() => setShowModal(false)}
            disabled={borrowing}
            className="text-[#59665D] hover:text-red-500"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <p className="mb-5 text-sm leading-6 text-[#59665D]">
          Please confirm that you want to borrow this book.
        </p>

        <div className="space-y-3 rounded-xl bg-[#F8F7F2] p-4 text-sm">
          <p className="text-[#59665D]">
            <span className="font-semibold text-[#29332D]">Book:</span>{" "}
            {book.title}
          </p>
          <p className="text-[#59665D]">
            <span className="font-semibold text-[#29332D]">Name:</span>{" "}
            {session?.user?.name || "Reader"}
          </p>
          <p className="break-all text-[#59665D]">
            <span className="font-semibold text-[#29332D]">Email:</span>{" "}
            {session?.user?.email}
          </p>
          <p className="text-[#59665D]">
            <span className="font-semibold text-[#29332D]">
              Borrow period:
            </span>{" "}
            14 days
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            disabled={borrowing}
            className="flex-1 rounded-lg border border-[#D9DED6] px-4 py-3 font-medium text-[#59665D]"
          >
            Cancel
          </button>

          <button
            onClick={handleBorrow}
            disabled={borrowing}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#607D68] px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {borrowing && (
              <LoaderCircle size={18} className="animate-spin" />
            )}
            {borrowing ? "Borrowing..." : "Confirm Borrow"}
          </button>
        </div>
      </div>
    </div>
  )}
</section>

);
}

export default function BookDetailsPage() {
return ( <ProtectedRoute> <BookDetailsContent /> </ProtectedRoute>
);
}
