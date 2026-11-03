"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Library,
  BookMarked,
  ShieldCheck,
  Heart,
  Search,
} from "lucide-react";

const HeroSlider = dynamic(() => import("../components/HeroSlider"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-[#E8EDE5]">
      <div className="text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 animate-pulse text-[#607D68]" />
        <p className="text-sm text-[#526357]">
          Preparing your reading room...
        </p>
      </div>
    </div>
  ),
});

const categories = [
  { name: "Fiction", icon: "📖", description: "Stories to get lost in" },
  { name: "Science", icon: "🔬", description: "Explore new discoveries" },
  { name: "History", icon: "🏛️", description: "Learn from the past" },
  { name: "Kids", icon: "🧸", description: "Little books, big dreams" },
  { name: "Others", icon: "✨", description: "Something for everyone" },
];

const benefits = [
  {
    icon: Library,
    title: "A world of books",
    description:
      "Explore a growing collection of books across different categories and interests.",
  },
  {
    icon: BookMarked,
    title: "Easy borrowing",
    description:
      "Borrow a book for a few days and return it when you are finished reading.",
  },
  {
    icon: ShieldCheck,
    title: "Your own library",
    description:
      "Keep track of the books you add and the books you borrow in one place.",
  },
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8A7656]">
        {eyebrow}
      </p>

      <h2 className="font-serif text-3xl font-semibold text-[#29332D] md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#68736B] md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function BookCard({ book }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#ECEDE8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64 overflow-hidden bg-[#F0F0E9]">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#607D68] shadow-sm">
          {book.category}
        </span>

        <button
          type="button"
          aria-label={`Save ${book.title}`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#607D68] shadow-sm transition hover:bg-[#607D68] hover:text-white"
        >
          <Bookmark size={17} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-[#29332D]">
          {book.title}
        </h3>

        <p className="mt-2 text-sm text-[#7A837B]">
          by {book.author}
        </p>

        <p className="mt-3 text-sm leading-6 text-[#68736B]">
          {book.description}
        </p>

        <Link
          href={`/books/${book._id}`}
          className="mt-5 flex items-center justify-between border-t border-[#ECEDE8] pt-4 text-sm font-semibold text-[#607D68] transition hover:text-[#34483B]"
        >
          View Details
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://booknook-server-uroj.onrender.com";

        const response = await fetch(`${apiUrl}/books`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        const sortedBooks = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0)
            )
          : [];

        setBooks(sortedBooks.slice(0, 6));
      } catch (error) {
        console.error("New arrivals error:", error);
        setBooks([]);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className="bg-[#F8F7F2] text-[#29332D]">
      {/* Hero Slider */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:px-8 md:pt-10">
        <HeroSlider />
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-4xl px-5 py-12 text-center md:py-16">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8A7656]">
          Welcome to BookNook
        </p>

        <h2 className="font-serif text-3xl font-semibold leading-tight text-[#29332D] md:text-5xl">
          Every book opens
          <br className="hidden md:block" /> a new little world.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#68736B] md:text-base">
          Find your next favourite read, share books with fellow readers,
          and make space for more stories in your life. Your reading
          journey starts here.
        </p>

        <Link
          href="/books"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#607D68] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#496451]"
        >
          Explore the Library
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Why BookNook */}
      <section className="bg-[#E8EDE5] px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="A better way to read"
            title="Your little library, made simple"
            description="Everything you need to discover books, share your favourites and keep your reading journey organised."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/70 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#607D68]">
                    <Icon size={25} />
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-[#29332D]">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#68736B]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="Fresh on the shelves"
          title="New Arrivals"
          description="Take a look at some books waiting to be discovered. Your next favourite might be right here."
        />

        {loadingBooks ? (
          <div className="py-12 text-center text-sm text-[#68736B]">
            Loading the latest books...
          </div>
        ) : books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-5 py-12 text-center">
            <BookOpen className="mx-auto mb-3 text-[#607D68]" size={32} />
            <p className="text-sm text-[#68736B]">
              No books have been added yet. Check back soon!
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-full border border-[#607D68] px-7 py-3 text-sm font-semibold text-[#607D68] transition hover:bg-[#607D68] hover:text-white"
          >
            See All Books
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F0EFE8] px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Find your next read"
            title="Explore Categories"
            description="From imaginative stories to fascinating discoveries, there is something for every kind of reader."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/books?category=${category.name}`}
                className="group rounded-2xl border border-[#E5E3DA] bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#C6A878] hover:shadow-md"
              >
                <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EDE5] text-2xl">
                  {category.icon}
                </span>

                <h3 className="font-serif text-lg font-semibold text-[#29332D]">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#7A837B]">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="Simple and convenient"
          title="How BookNook Works"
          description="Getting your next book is easy. Just follow three simple steps."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              number: "01",
              icon: Search,
              title: "Discover",
              description:
                "Browse the library and find a book that catches your interest.",
            },
            {
              number: "02",
              icon: BookOpen,
              title: "Borrow",
              description:
                "Choose your book and confirm your borrowing details.",
            },
            {
              number: "03",
              icon: Heart,
              title: "Enjoy & Return",
              description:
                "Enjoy your reading time and return the book when you finish.",
            },
          ].map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8EDE5] text-[#607D68]">
                  <Icon size={25} />
                </div>

                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#B29A70]">
                  STEP {step.number}
                </p>

                <h3 className="font-serif text-xl font-semibold text-[#29332D]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-[#68736B]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reader Message */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#34483B] px-6 py-14 text-center text-white md:px-16 md:py-20">
          <BookOpen className="mx-auto mb-6 h-9 w-9 text-[#D8C39D]" />

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#D8C39D]">
            A place for every reader
          </p>

          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold leading-tight text-white md:text-5xl">
            Great stories are even better when shared.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#D3DDD4] md:text-base">
            Add a book to the collection, discover something new, and
            become part of a community that loves reading.
          </p>

          <Link
            href="/books"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E8EDE5] px-7 py-3.5 text-sm font-semibold text-[#34483B] transition hover:bg-white"
          >
            Start Exploring
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}