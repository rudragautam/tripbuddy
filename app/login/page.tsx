"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const sliderImages = [
  "/images/2-CCwxLBNf.jpg",
  "/images/3-D7srdLDQ.jpg",
  "/images/5-B137TKjW.jpg",
];

export default function Login() {
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-black">

      {/* Static Background */}
      <Image
        src="/images/6-B5p4dsBR.jpg"
        alt="Background"
        fill
        className="object-cover opacity-30"
        priority
      />

{/* Center Compact Card */}
<div className="relative z-10 w-[950px] max-w-[95%] h-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">

  {/* LEFT SIDE SLIDER */}
  <div className="relative w-1/2 h-full hidden md:block">

    {sliderImages.map((img, index) => (
      <Image
        key={index}
        src={img}
        alt="Travel"
        fill
        className={`object-cover transition-opacity duration-1000 ${
          index === current ? "opacity-100" : "opacity-0"
        }`}
      />
    ))}

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* Text */}
    <div className="absolute bottom-12 left-12 text-white max-w-xs">
      <p className="uppercase text-[10px] tracking-[0.3em] text-gray-300 mb-3">
        Traveling App
      </p>

      <h2 className="text-2xl font-semibold leading-snug">
        Meet people from all over the world and make lasting relationships
      </h2>
    </div>

    {/* Indicators */}
    <div className="absolute bottom-6 left-12 flex gap-2">
      {sliderImages.map((_, index) => (
        <div
          key={index}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            index === current
              ? "w-8 bg-white"
              : "w-3 bg-white/50"
          }`}
        />
      ))}
    </div>

  </div>

  {/* RIGHT SIDE FORM */}
  <div className="w-full md:w-1/2 flex items-center justify-center px-10">

    <div className="w-full max-w-sm">

      <div className="mb-8">
         {/* Logo */}
  <div className="flex justify-center mb-6">
    <Image
      src="/icons/logo.png"   // ← replace with your logo path
      alt="TripBuddy"
      width={150}
      height={150}
      className="object-contain"
    />
  </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Back
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Sign in to continue your journey
        </p>
      </div>

      {step === "phone" && (
        <div className="space-y-4">

          <input
            type="tel"
            placeholder="Phone number"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-orange-500
                       text-sm"
          />

          <button
            onClick={() => setStep("otp")}
            className="w-full bg-orange-500 hover:bg-orange-600 
                       transition py-3 rounded-lg text-white font-medium text-sm"
          >
            Send OTP
          </button>

        </div>
      )}

      {step === "otp" && (
        <div className="space-y-4">

          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 
                       text-center text-lg tracking-widest
                       focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button className="w-full bg-orange-500 hover:bg-orange-600 
                             transition py-3 rounded-lg text-white font-medium text-sm">
            Verify & Login
          </button>

          <button
            onClick={() => setStep("phone")}
            className="text-xs text-gray-500 hover:text-orange-500 transition"
          >
            Change number
          </button>

        </div>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-[11px] text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Social Icons Compact */}
      <div className="flex justify-center gap-4">

        <button className="w-11 h-11 rounded-full bg-white shadow-md 
                           flex items-center justify-center
                           hover:scale-110 transition">
          <Image src="/icons/google.png" alt="Google" width={18} height={18} />
        </button>

        <button className="w-11 h-11 rounded-full bg-white shadow-md 
                           flex items-center justify-center
                           hover:scale-110 transition">
          <Image src="/icons/facebook.png" alt="Facebook" width={18} height={18} />
        </button>

        <button className="w-11 h-11 rounded-full bg-white shadow-md 
                           flex items-center justify-center
                           hover:scale-110 transition">
          <Image src="/icons/instagram.png" alt="Instagram" width={18} height={18} />
        </button>

      </div>

    </div>
  </div>

</div>
    </main>
  );
}