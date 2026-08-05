"use client";
import React from "react";
import { motion } from "framer-motion";

export const AceternityBalloons = () => {
  // 14 Farklı canlı çocuk/anaokulu tonunda zıplayan & süzülen balonlar
  const balloons = [
    { id: 1, size: "w-16 h-20", color: "from-pink-400 via-rose-500 to-red-400", shadow: "shadow-pink-400/50", left: "5%", delay: 0, duration: 14, scale: 1 },
    { id: 2, size: "w-20 h-24", color: "from-amber-300 via-yellow-400 to-orange-400", shadow: "shadow-amber-400/50", left: "15%", delay: 2, duration: 18, scale: 1.1 },
    { id: 3, size: "w-14 h-18", color: "from-sky-300 via-blue-400 to-indigo-400", shadow: "shadow-sky-400/50", left: "28%", delay: 5, duration: 15, scale: 0.9 },
    { id: 4, size: "w-24 h-28", color: "from-emerald-300 via-green-400 to-teal-400", shadow: "shadow-emerald-400/50", left: "40%", delay: 1, duration: 20, scale: 1.25 },
    { id: 5, size: "w-16 h-20", color: "from-purple-400 via-violet-500 to-fuchsia-400", shadow: "shadow-purple-400/50", left: "52%", delay: 7, duration: 16, scale: 1 },
    { id: 6, size: "w-20 h-24", color: "from-rose-300 via-pink-400 to-purple-400", shadow: "shadow-pink-400/50", left: "65%", delay: 3, duration: 17, scale: 1.15 },
    { id: 7, size: "w-14 h-18", color: "from-orange-300 via-amber-400 to-yellow-400", shadow: "shadow-orange-400/50", left: "78%", delay: 6, duration: 14, scale: 0.85 },
    { id: 8, size: "w-22 h-26", color: "from-cyan-300 via-sky-400 to-blue-500", shadow: "shadow-cyan-400/50", left: "90%", delay: 4, duration: 19, scale: 1.2 },
    { id: 9, size: "w-12 h-16", color: "from-lime-300 via-emerald-400 to-green-500", shadow: "shadow-lime-400/50", left: "22%", delay: 9, duration: 13, scale: 0.8 },
    { id: 10, size: "w-18 h-22", color: "from-fuchsia-400 via-pink-500 to-rose-400", shadow: "shadow-fuchsia-400/50", left: "85%", delay: 8, duration: 15, scale: 1.05 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Dynamic Glowing Radial Gradients (Aceternity UI Glow) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-300/40 via-purple-300/30 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-gradient-to-bl from-amber-300/40 via-orange-300/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute -bottom-20 left-1/3 w-[28rem] h-[28rem] bg-gradient-to-tr from-sky-300/40 via-emerald-300/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />

      {/* Floating Framer-Motion Aceternity Balonlar */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: "110vh", x: 0, rotate: -5, opacity: 0 }}
          animate={{
            y: ["110vh", "-20vh"],
            x: [0, 15, -15, 20, -10, 0],
            rotate: [-5, 8, -8, 6, -5],
            opacity: [0, 0.9, 0.9, 0.9, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
          style={{ left: b.left }}
          className="absolute bottom-0 flex flex-col items-center group cursor-pointer"
        >
          {/* Balon Gövdesi */}
          <div
            className={`relative ${b.size} rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.color} shadow-2xl ${b.shadow} border-2 border-white/60 backdrop-blur-sm flex items-center justify-center`}
          >
            {/* Balon Işık Parıltısı / Reflection */}
            <div className="absolute top-2 left-3 w-4 h-6 bg-white/50 rounded-full rotate-[-30deg] blur-[1px]" />
            <div className="absolute top-4 left-5 w-2 h-2 bg-white/80 rounded-full" />
            
            {/* Minik Sevimli Yıldız Motifleri */}
            <span className="text-white/40 text-xs font-black select-none pointer-events-none">⭐</span>
          </div>

          {/* Balon Bağlantı Düğümü */}
          <div className="w-2.5 h-2 bg-amber-600/80 rounded-b-sm -mt-0.5" />

          {/* İp / Kıvrımlı Balon İpi */}
          <svg className="w-4 h-12 text-slate-400/60 -mt-0.5" viewBox="0 0 20 60" fill="none">
            <path
              d="M10 0 Q16 15 10 30 Q4 45 10 60"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}

      {/* Işıltılı Sparkle Yıldız Parçacıkları (Aceternity Sparkles Grid Effect) */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
    </div>
  );
};
