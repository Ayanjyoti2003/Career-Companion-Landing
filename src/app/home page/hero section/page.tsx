"use client";

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const images = [
        "/hero_1.jpg",
        "/hero_2.png",
        "/hero_3.jpg",
    ];

    return (
        <section id="hero" className="bg-blue-50 py-10 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* LEFT CONTENT */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        Build a <span className="text-blue-600">Clear Career Path</span><br />
                        With AI Guidance
                    </h1>

                    <p className="text-gray-600 mt-4 text-lg max-w-md">
                        Discover your interests, explore career options, create a strong resume,
                        and take guided steps toward your dream future — all in one place.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                            href="/dashboard"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center"
                        >
                            Go to Dashboard →
                        </Link>

                        <button className="border border-gray-400 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* RIGHT CAROUSEL */}
                <div className="flex justify-center items-center">
                    <div className="w-full h-[380px] md:h-[430px] rounded-2xl overflow-hidden shadow-xl">
                        <Slider {...settings}>
                            {images.map((img, i) => (
                                <div key={i}>
                                    <Image
                                        src={img}
                                        alt={`slider-${i}`}
                                        width={900}
                                        height={600}
                                        className="w-full h-full object-contain bg-white p-4"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

            </div>
        </section>
    );
}
