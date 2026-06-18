import React, { useState } from "react";
import { Link } from "react-router-dom";
import { libraryData } from "../data/libraryData";
import { mediaData } from "../data/mediaData";
import { useAudio } from "../context/AudioContext";
import Navbar from "../components/Navbar/Navbar";

// تعريف نوع الـ Props لاستقبال searchTerm من الأب
interface LibraryProps {
  searchTerm: string;
}

const Library: React.FC<LibraryProps> = ({ searchTerm }) => {
  const [activeMood, setActiveMood] = useState("joy");
  const [activeTab, setActiveTab] = useState("all");
  const { playTrack } = useAudio();
  const moods = [
    { id: "all", label: "All Moods", icon: "≡" },
    { id: "joy", label: "Joyful", icon: "😊" },
    { id: "anger", label: "Anger", icon: "😡" },
    { id: "fear", label: "Fear", icon: "😨" },
    { id: "sadness", label: "Sadness", icon: "😔" },
    { id: "neutral", label: "Neutral", icon: "😐" },
    { id: "disgust", label: "Disgust", icon: "🤢" },
    { id: "surprise", label: "Surprise", icon: "😯" },
  ];

  const getBannerContent = () => {
    switch (activeMood) {
      case "anger":
        return {
          title: "Heavy Thoughts?",
          desc: "Don't hold it in. Use your journal to vent and release the tension safely.",
        };
      case "sadness":
        return {
          title: "Need a safe space?",
          desc: "It's okay to feel this way. Pour your heart out in your private journal.",
        };
      case "joy":
        return {
          title: "Capturing the light?",
          desc: "Write down what made you smile today so you can revisit this warmth later.",
        };
      case "fear":
        return {
          title: "Facing the unknown?",
          desc: "Break down your worries into words. Writing makes them feel smaller and manageable.",
        };
      default:
        return {
          title: "Mindful Reflection",
          desc: "The best way to understand your feelings is to put them on paper.",
        };
    }
  };

  const banner = getBannerContent();

  const filteredExercises =
    activeMood === "all"
      ? libraryData
      : libraryData.filter((item) => item.mood === activeMood);

  const filteredMedia =
    activeMood === "all"
      ? mediaData
      : mediaData.filter((item) => item.mood === activeMood);

  const displayContent = () => {
    let content = [];
    if (activeTab === "exercises") content = filteredExercises;
    else if (activeTab === "media") content = filteredMedia;
    else content = [...filteredExercises, ...filteredMedia];

    return content.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-[#fcfdfe] pb-28">
        <main className="flex-1 overflow-y-auto px-11 py-10">
          <div className="flex justify-between items-start mb-11">
            <div>
              <span className="bg-[#fff7ed] text-[#f97316] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-inner shadow-orange-100">
                Active Filter
              </span>
              <h2 className="text-5xl font-black text-[#1e293b] mt-4 tracking-tight capitalize">
                {activeMood} Library
              </h2>
              <p className="text-lg text-[#94a3b8] mt-3 font-medium max-w-lg">
                Personalized content based on your mood.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-w-[240px]">
              <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] ml-2">
                Choose Your Mood
              </label>
              <div className="relative group">
                <select
                  value={activeMood}
                  onChange={(e) => setActiveMood(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-[#f1f5f9] text-[#1e293b] font-bold py-4 px-6 rounded-[1.5rem] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#2563eb] transition-all shadow-sm group-hover:border-gray-200 text-sm"
                >
                  {moods.map((mood) => (
                    <option key={mood.id} value={mood.id}>
                      {mood.icon} &nbsp; {mood.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 font-bold">
                  ↓
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-11 border-b border-gray-100 mb-11 text-base font-bold text-[#94a3b8]">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-5 transition-all ${activeTab === "all" ? "text-[#2563eb] border-b-4 border-[#2563eb]" : "hover:text-[#64748b]"}`}
            >
              All Content
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`pb-5 transition-all ${activeTab === "exercises" ? "text-[#2563eb] border-b-4 border-[#2563eb]" : "hover:text-[#64748b]"}`}
            >
              Exercises ({filteredExercises.length})
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`pb-5 transition-all ${activeTab === "media" ? "text-[#2563eb] border-b-4 border-[#2563eb]" : "hover:text-[#64748b]"}`}
            >
              Media & Podcasts ({filteredMedia.length})
            </button>
          </div>

          <div className="bg-[#eff6ff] rounded-[2.5rem] p-10 mb-11 flex justify-between items-center border border-blue-50 relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] opacity-60"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-blue-600 border border-blue-100/50">
                <span className="text-3xl">🗒️</span>
              </div>
              <div>
                <h4 className="font-extrabold text-2xl text-[#1e293b]">
                  {banner.title}
                </h4>
                <p className="text-base text-[#64748b] font-medium mt-1 max-w-xl">
                  {banner.desc}
                </p>
              </div>
            </div>
            <Link
              to="/journal"
              className="bg-[#2563eb] text-white px-9 py-4 rounded-3xl text-sm font-black hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-200 relative z-20 flex items-center justify-center"
            >
              Open Journal
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {displayContent().map((item) => {
              const isMediaItem = "thumbnail" in item;
              const imageSrc = isMediaItem
                ? (item as any).thumbnail
                : (item as any).img;

              return (
                <div
                  key={`${item.id}-${item.title}`}
                  className="group cursor-pointer"
                  onClick={() =>
                    playTrack(
                      item as unknown as Parameters<typeof playTrack>[0],
                    )
                  }
                >
                  <div
                    className={`aspect-square rounded-[3rem] mb-6 overflow-hidden relative shadow-md group-hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-3 border-4 border-white/50 ${isMediaItem ? "bg-purple-50" : "bg-blue-50"}`}
                  >
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-5xl">
                      {item.type === "Audio"
                        ? "🎵"
                        : item.type === "Video"
                          ? "🎥"
                          : "🧘"}
                    </div>
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black shadow-sm uppercase tracking-tighter text-gray-700">
                      {item.type}
                    </div>
                  </div>
                  <h3 className="font-black text-xl text-[#1e293b] leading-snug group-hover:text-[#2563eb] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-2.5 font-extrabold tracking-wider uppercase flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${isMediaItem ? "bg-purple-500" : "bg-blue-500"}`}
                    ></span>
                    {isMediaItem ? (item as any).duration : (item as any).info}
                  </p>
                  <p className="text-[13px] text-[#64748b] mt-3 font-medium line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {displayContent().length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold text-xl">
                No results found for "{searchTerm}"
              </p>
            </div>
          )}
        </main>

        <aside className="w-[420px] p-10 hidden lg:flex flex-col gap-8 bg-[#fcfdfe]">
          <div className="bg-white rounded-[3rem] p-10 shadow-3xl shadow-gray-100 flex-1 flex flex-col border border-gray-50 relative overflow-hidden">
            <div className="mb-8 relative z-10">
              <h3 className="font-black text-2xl text-[#1e293b]">
                Chatbot Support
              </h3>
              <p className="text-sm text-[#94a3b8] font-bold mt-1.5">
                Exploring <strong>{activeMood}</strong> resources.
              </p>
            </div>
            <div className="flex-1 space-y-7 relative z-10">
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-blue-200">
                  🤖
                </div>
                <div className="bg-[#f8fafc] p-5 rounded-3xl rounded-tl-none text-sm leading-relaxed font-medium shadow-sm">
                  {`Hello Mazen! Ready to dive into some ${activeMood} ${activeTab === "media" ? "content" : "exercises"}?`}
                </div>
              </div>
            </div>
            <div className="mt-10 space-y-4 relative z-10">
              <button className="bg-[#2563eb] text-white w-full py-4.5 rounded-2xl font-black text-base shadow-2xl hover:bg-blue-700 transition-all active:scale-95">
                Start Chat Now
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Library;
