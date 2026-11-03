import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#34483B] text-[#F8F7F2]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="mb-4 inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#607D68]">
              <BookOpen size={24} />
            </div>

            <span className="font-serif text-2xl font-bold">
              BookNook
            </span>
          </Link>

          <p className="mt-3 max-w-md text-sm leading-7 text-[#d3ddd2]">
            A welcoming space to discover, borrow and enjoy wonderful books.
            Every reader belongs here.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold">
            Explore
          </h3>

          <ul className="space-y-3 text-sm text-[#d3ddd2]">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-white">
                All Books
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold">
            Contact Us
          </h3>

          <ul className="space-y-4 text-sm text-[#d3ddd2]">
            <li className="flex items-center gap-3">
              <Mail size={17} />
              hello@booknook.com
            </li>

            <li className="flex items-center gap-3">
              <Phone size={17} />
              +880 1700-000000
            </li>

            <li className="flex items-center gap-3">
              <MapPin size={17} />
              Bangladesh
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/15 px-5 py-5 text-center text-xs text-[#c4d0c3]">
        © 2026 BookNook. All rights reserved.
      </div>
    </footer>
  );
}