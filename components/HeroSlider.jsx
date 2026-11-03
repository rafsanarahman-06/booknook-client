"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    label: "WELCOME TO BOOKNOOK",
    title: "Every book opens a new world.",
    description:
      "Discover wonderful stories, explore new ideas and find your next favourite book.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400",
  },
  {
    label: "YOUR NEXT CHAPTER STARTS HERE",
    title: "A little reading goes a long way.",
    description:
      "From timeless classics to exciting discoveries, there is something for every reader.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1400",
  },
  {
    label: "READ. BORROW. RETURN.",
    title: "Good books are meant to be shared.",
    description:
      "Explore our collection and enjoy the simple pleasure of reading.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1400",
  },
];

export default function HeroSlider() {
  return (
    <section className="container-width py-7">
      <div className="overflow-hidden rounded-2xl">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop
          className="hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative flex min-h-[440px] items-center bg-[#E8EDE5]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#F8F7F2] via-[#F8F7F2]/90 to-transparent" />

                <div className="relative z-10 max-w-xl px-7 py-16 sm:px-14 lg:px-20">
                  <span className="mb-5 inline-block text-xs font-bold tracking-[0.2em] text-[#607D68]">
                    {slide.label}
                  </span>

                  <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-[#29332D] sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mb-8 max-w-md text-base leading-7 text-[#515951]">
                    {slide.description}
                  </p>

                  <Link href="/books" className="primary-button">
                    Explore Books <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}