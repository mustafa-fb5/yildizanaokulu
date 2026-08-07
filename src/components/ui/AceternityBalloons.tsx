"use client";
import React from "react";
import { motion } from "framer-motion";

export const AceternityBalloons = () => {
  // 8 Canlı, GPU optimizasyonlu balon (Takılmasız 60fps performans için)
  const balloons = [
    { id: 1, size: "w-16 h-20 sm:w-20 sm:h-24", color: "from-pink-400 via-rose-500 to-red-400", shadow: "shadow-pink-400/40", left: "5%", delay: 0, duration: 14, icon: "⭐" },
    { id: 2, size: "w-20 h-24 sm:w-24 sm:h-28", color: "from-amber-300 via-yellow-400 to-orange-400", shadow: "shadow-amber-400/40", left: "18%", delay: 2, duration: 18, icon: "🎨" },
    { id: 3, size: "w-14 h-18 sm:w-16 sm:h-20", color: "from-sky-300 via-blue-400 to-indigo-400", shadow: "shadow-sky-400/40", left: "32%", delay: 5, duration: 15, icon: "🚀" },
    { id: 4, size: "w-22 h-26 sm:w-26 sm:h-30", color: "from-emerald-300 via-green-400 to-teal-400", shadow: "shadow-emerald-400/40", left: "46%", delay: 1, duration: 20, icon: "🎈" },
    { id: 5, size: "w-16 h-20 sm:w-20 sm:h-24", color: "from-purple-400 via-violet-500 to-fuchsia-400", shadow: "shadow-purple-400/40", left: "60%", delay: 7, duration: 16, icon: "✨" },
    { id: 6, size: "w-20 h-24 sm:w-24 sm:h-28", color: "from-rose-300 via-pink-400 to-purple-400", shadow: "shadow-pink-400/40", left: "74%", delay: 3, duration: 17, icon: "🌟" },
    { id: 7, size: "w-14 h-18 sm:w-16 sm:h-20", color: "from-orange-300 via-amber-400 to-yellow-400", shadow: "shadow-orange-400/40", left: "86%", delay: 6, duration: 14, icon: "🧸" },
    { id: 8, size: "w-18 h-22 sm:w-20 sm:h-24", color: "from-cyan-300 via-sky-400 to-blue-500", shadow: "shadow-cyan-400/40", left: "88%", delay: 4, duration: 19, icon: "🌈" },
  ];

  // Tatlı uçuşan bulutlar
  const clouds = [
    { id: 1, top: "12%", left: "-10%", scale: 1.2, duration: 32, delay: 0 },
    { id: 2, top: "40%", left: "-15%", scale: 0.9, duration: 38, delay: 8 },
  ];

  // Parıldayan Yıldızlar
  const stars = [
    { top: "10%", left: "12%", color: "text-amber-400", delay: 0 },
    { top: "22%", left: "85%", color: "text-pink-400", delay: 1.5 },
    { top: "45%", left: "8%", color: "text-sky-400", delay: 0.8 },
    { top: "65%", left: "92%", color: "text-purple-400", delay: 2.2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transform-gpu" style={{ willChange: "transform" }}>
      
      {/* 1. Aceternity UI Grid & Dot Pattern (GPU Dostu) */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-35 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_90%)]" />

      {/* 2. Donanım İvmelendirmeli Yumuşak Radial Işıklar (Taşma Olmayan Boyutlarla) */}
      <div
        className="absolute -top-20 -left-20 w-[60%] max-w-[32rem] h-[60%] max-h-[32rem] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(249,115,22,0.2) 40%, transparent 70%)"
        }}
      />

      <div
        className="absolute top-1/4 right-0 w-[60%] max-w-[34rem] h-[60%] max-h-[34rem] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)"
        }}
      />

      <div
        className="absolute bottom-10 left-[15%] w-[55%] max-w-[30rem] h-[55%] max-h-[30rem] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)"
        }}
      />

      {/* 3. Uçuşan Bulutlar (Hafif ve Akıcı - % bazlı taşmasız) */}
      {clouds.map((c) => (
        <motion.div
          key={c.id}
          initial={{ x: "-15%" }}
          animate={{ x: "110%" }}
          transition={{ duration: c.duration, repeat: Infinity, ease: "linear", delay: c.delay }}
          style={{ top: c.top, transform: `scale(${c.scale}) translateZ(0)` }}
          className="absolute opacity-55 text-slate-300 text-6xl select-none will-change-transform"
        >
          ☁️
        </motion.div>
      ))}

      {/* 4. Yanıp Sönen Yıldızlar */}
      {stars.map((s, idx) => (
        <motion.div
          key={idx}
          animate={{
            scale: [0.85, 1.2, 0.85],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          style={{ top: s.top, left: s.left, transform: "translateZ(0)" }}
          className={`absolute w-5 h-5 ${s.color} font-black text-xl select-none will-change-transform`}
        >
          ✨
        </motion.div>
      ))}

      {/* 5. Framer-Motion Aceternity Süzülen Balonlar (GPU Destekli 60 FPS) */}
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: "115vh", x: 0, rotate: -5, opacity: 0 }}
          animate={{
            y: ["115vh", "-25vh"],
            x: [0, 14, -14, 18, -10, 0],
            rotate: [-4, 8, -8, 6, -4],
            opacity: [0, 0.95, 0.95, 0.95, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
          style={{ left: b.left, transform: "translateZ(0)" }}
          className="absolute bottom-0 flex flex-col items-center group cursor-pointer will-change-transform"
        >
          {/* Balon Gövdesi */}
          <div
            className={`relative ${b.size} rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.color} shadow-lg ${b.shadow} border-2 border-white/80 flex items-center justify-center`}
          >
            {/* Balon Işık Parıltısı / Reflection */}
            <div className="absolute top-2 left-3 w-3.5 h-6 bg-white/60 rounded-full rotate-[-30deg]" />
            <div className="absolute top-3.5 left-4.5 w-1.5 h-1.5 bg-white/90 rounded-full" />
            
            {/* Minik Sevimli Motif */}
            <span className="text-white/90 text-sm sm:text-base font-black select-none drop-shadow-sm">
              {b.icon}
            </span>
          </div>

          {/* Balon Düğümü */}
          <div className="w-2.5 h-2 bg-amber-600/80 rounded-b-sm -mt-0.5" />

          {/* Kıvrımlı İp */}
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

    </div>
  );
};
