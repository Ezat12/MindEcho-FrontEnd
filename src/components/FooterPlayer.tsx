import React from "react";
import { useAudio } from "../context/AudioContext";

const FooterPlayer = () => {
  // جلب كل الوظائف والحالات الجديدة من الـ Context
  const {
    currentTrack,
    isPlaying,
    isShuffle,
    isRepeat,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
  } = useAudio();

  // بيانات افتراضية في حالة عدم تشغيل أي مقطع
  const trackInfo = currentTrack || {
    title: "MindEcho Ambient",
    mood: "Joy",
    thumbnail:
      "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=400",
  };

  return (
    <footer className="h-28 px-10 flex items-center justify-between bg-white/95 backdrop-blur-xl sticky bottom-0 z-50 shadow-t-sm border-t border-gray-100">
      {/* 1. الجزء الشمال: معلومات المقطع */}
      <div className="flex items-center gap-6 w-1/4">
        <img
          src={trackInfo.thumbnail}
          alt="Album"
          className="w-17 h-17 rounded-2xl shadow-xl object-cover border-2 border-gray-50 transition-all duration-500"
        />
        <div className="min-w-0">
          <h5 className="font-black text-base text-[#1e293b] truncate">
            {trackInfo.title}
          </h5>
          <p className="text-xs text-[#94a3b8] font-extrabold mt-1 uppercase tracking-wider">
            Playing for {trackInfo.mood}
          </p>
        </div>
      </div>

      {/* 2. الجزء اللي في النص: التحكم في التشغيل */}
      <div className="flex flex-col items-center gap-3.5 w-1/2">
        <div className="flex items-center gap-9">
          {/*تبديل عشوائي*/}
          <button
            onClick={toggleShuffle}
            className={`text-xl transition-colors ${isShuffle ? "text-[#2563eb] scale-110" : "text-gray-400 hover:text-blue-400"}`}
            title="Shuffle"
          >
            🔀
          </button>

          {/* القبله */}
          <button
            onClick={prevTrack}
            className="text-2xl font-black hover:scale-120 hover:text-[#2563eb] transition-all active:scale-90"
          >
            ⏮
          </button>

          {/* تشغيل و وقف */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-[#2563eb] text-white rounded-full flex items-center justify-center text-2xl shadow-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? "⏸" : "▶️"}
          </button>

          {/* االبعده */}
          <button
            onClick={nextTrack}
            className="text-2xl font-black hover:scale-120 hover:text-[#2563eb] transition-all active:scale-90"
          >
            ⏭
          </button>

          {/*تكرار */}
          <button
            onClick={toggleRepeat}
            className={`text-xl transition-colors ${isRepeat ? "text-[#2563eb] scale-110" : "text-gray-400 hover:text-blue-400"}`}
            title="Repeat"
          >
            🔁
          </button>
        </div>

        {/* الـ Progress Bar (ثابت حالياً حتى نربط وقت الـ Audio الحقيقي) */}
        <div className="w-full max-w-lg flex items-center gap-3.5">
          <span className="text-xs font-bold text-gray-400">1:24</span>
          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner cursor-pointer group">
            <div className="bg-[#2563eb] h-full w-1/3 rounded-full group-hover:bg-blue-400 transition-colors"></div>
          </div>
          <span className="text-xs font-bold text-gray-400">3:58</span>
        </div>
      </div>

      {/* 3. الجزء اليمين: الصوت */}
      <div className="w-1/4 flex justify-end items-center gap-7">
        <span className="text-gray-400 text-xl cursor-pointer hover:text-blue-500">
          🔊
        </span>
        <div className="w-28 bg-gray-100 h-1.5 rounded-full shadow-inner cursor-pointer overflow-hidden">
          <div className="bg-blue-400 h-full w-2/3 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPlayer;
