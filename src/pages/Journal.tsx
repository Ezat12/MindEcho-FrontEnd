import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";

import toast from "react-hot-toast";
import {
  Trash2,
  Edit,
  X,
  Check,
  Eye,
  Sparkles,
  Calendar,
  Smile,
  Image,
  Send,
} from "lucide-react";
import axiosInstance from "../api/axiosConfig";

// تعريف أنواع البيانات
interface JournalPost {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Echo {
  id: number;
  title: string;
  img: string;
}

const Journal = () => {
  // State لليوميات
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("Joy");
  const [history, setHistory] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  // State للتعديل
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood] = useState("");

  // State لعرض التفاصيل
  const [viewingPost, setViewingPost] = useState<JournalPost | null>(null);

  // State للصور (Happy Echoes)
  const [echoes, setEchoes] = useState<Echo[]>([
    {
      id: 1,
      title: "Sunset calm",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
    },
  ]);

  // State للـ Modal ورفع الصور
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    { char: "😊", label: "Joy", color: "bg-amber-100", icon: "🌟" },
    { char: "❤️", label: "Loved", color: "bg-rose-100", icon: "💕" },
    { char: "⭐", label: "Proud", color: "bg-yellow-100", icon: "🎯" },
    { char: "✨", label: "Inspired", color: "bg-purple-100", icon: "🌈" },
    { char: "🌿", label: "Calm", color: "bg-emerald-100", icon: "🍃" },
  ];

  // 🔹 جلب كل يوميات المستخدم
  useEffect(() => {
    fetchUserJournals();
  }, []);

  const fetchUserJournals = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/Journal/user`);

      console.log("Journals response:", res.data);

      if (res.data?.success && res.data?.data) {
        const journals = res.data.data.map((journal: any) => ({
          id: journal.id,
          title: journal.title || "Untitled",
          content: journal.content,
          mood: journal.mood || "Joy",
          date:
            journal.date ||
            new Date(journal.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          createdAt: journal.createdAt,
          updatedAt: journal.updatedAt,
        }));
        setHistory(journals);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error fetching journals:", error);
      toast.error(err.response?.data?.message || "Failed to load journals");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 جلب يومية واحدة بواسطة ID
  const fetchJournalById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/Journal/${id}`);

      console.log("Journal by ID response:", res.data);

      if (res.data?.success && res.data?.data) {
        const journal = res.data.data;
        setViewingPost({
          id: journal.id,
          title: journal.title || "Untitled",
          content: journal.content,
          mood: journal.mood || "Joy",
          date:
            journal.date ||
            new Date(journal.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error fetching journal:", error);
      toast.error(err.response?.data?.message || "Failed to load journal");
    }
  };

  // 🔹 إنشاء يومية جديدة
  // Journal.tsx

  // 🔹 إنشاء يومية جديدة
  const handleSaveEntry = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title! ✨");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write something! ✨");
      return;
    }

    try {
      const currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);
      formData.append("Date", currentDate);

      console.log("Sending formData:", {
        Title: title,
        Content: content,
        Date: currentDate,
      });

      const response = await axiosInstance.post(`/Journal`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Save response:", response);

      if (response.data?.success) {
        toast.success(`"${title}" saved with ${selectedEmoji} mood!`);
        setTitle("");
        setContent("");
        fetchUserJournals();
      } else {
        toast.error(response.data?.message || "Failed to save journal");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error saving journal:", error);
      console.error("Response data:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save journal");
    }
  };
  // 🔹 حذف يومية
  const handleDeleteJournal = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reflection?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/Journal/${id}`);

      console.log("Delete response:", res.data);

      if (res.data?.success) {
        toast.success("Journal deleted successfully");
        fetchUserJournals();
      } else {
        toast.error(res.data?.message || "Failed to delete journal");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error deleting journal:", error);
      toast.error(err.response?.data?.message || "Failed to delete journal");
    }
  };

  // 🔹 فتح نافذة التعديل
  const handleEditClick = (post: JournalPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditMood(post.mood);
  };

  // 🔹 حفظ التعديل
  const handleUpdateJournal = async () => {
    if (!editingPost) return;
    if (!editTitle.trim()) {
      toast.error("Please enter a title! ✨");
      return;
    }
    if (!editContent.trim()) {
      toast.error("Please write something! ✨");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Id", editingPost.id);
      formData.append("Title", editTitle);
      formData.append("Content", editContent);

      const res = await axiosInstance.post(`/Journal/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update response:", res.data);

      if (res.data?.success) {
        toast.success("Journal updated successfully");
        setEditingPost(null);
        setEditTitle("");
        setEditContent("");
        setEditMood("");
        fetchUserJournals();
      } else {
        toast.error(res.data?.message || "Failed to update journal");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Error updating journal:", error);
      toast.error(err.response?.data?.message || "Failed to update journal");
    }
  };

  // 🔹 فتح نافذة العرض
  const handleViewClick = async (post: JournalPost) => {
    await fetchJournalById(post.id);
  };

  // دالة رفع الملفات
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNewEcho = () => {
    if (tempImage) {
      const newEcho = {
        id: Date.now(),
        title: tempTitle || "Moment",
        img: tempImage,
      };
      setEchoes([newEcho, ...echoes].slice(0, 4));
      setIsModalOpen(false);
      setTempImage(null);
      setTempTitle("");
      toast.success("Moment added to Happy Echoes!");
    }
  };

  const getMoodStyle = (mood: string) => {
    const moodObj = emojis.find((e) => e.label === mood);
    return moodObj?.color || "bg-gray-100";
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 font-sans pb-20 relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>

        <main className="max-w-6xl mx-auto pt-16 px-6 relative">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm mb-6">
              <Sparkles className="size-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600">
                Your Safe Space
              </span>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              My Journal
            </h1>
            <p className="text-lg text-slate-500 mt-3">
              Capture your thoughts, feelings, and special moments
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* 1. Main Journal Card - Improved Design */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-xl border border-white/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">✍️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Daily Reflection
                    </h3>
                    <p className="text-sm text-slate-400">
                      Write what's in your heart
                    </p>
                  </div>
                </div>

                {/* Prompt Card */}
                <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-2xl p-6 mb-6 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="size-4 text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Today's Prompt
                    </span>
                  </div>
                  <p className="text-lg font-medium text-slate-700 italic">
                    "What made you smile today? What are you grateful for?"
                  </p>
                </div>

                {/* Title Input */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-600">
                      Title
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your reflection a title..."
                    className="w-full text-xl font-bold outline-none bg-transparent border-b-2 border-slate-200 focus:border-blue-400 pb-2 placeholder:text-slate-300 transition-colors"
                  />
                </div>

                {/* Content Textarea */}
                <div className="mb-6">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your thoughts here..."
                    className="w-full h-48 text-lg font-medium outline-none leading-relaxed bg-transparent resize-none placeholder:text-slate-300"
                  />
                </div>

                {/* Mood Selector */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <Smile className="size-5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      How are you feeling?
                    </span>
                    <div className="flex gap-2">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji.label}
                          onClick={() => setSelectedEmoji(emoji.label)}
                          className={`relative group transition-all duration-200 ${
                            selectedEmoji === emoji.label
                              ? "scale-110"
                              : "opacity-50 hover:opacity-80"
                          }`}
                        >
                          <div
                            className={`text-2xl p-1.5 rounded-full transition-all ${
                              selectedEmoji === emoji.label
                                ? `${emoji.color} ring-2 ring-blue-400 ring-offset-2`
                                : ""
                            }`}
                          >
                            {emoji.char}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleSaveEntry}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="size-4" />
                    Save Reflection
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Happy Echoes Section */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Image className="size-6 text-green-500" />
                    Happy Echoes
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Moments that light up your day
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border-2 border-dashed border-slate-200 text-slate-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center gap-2"
                >
                  <span className="text-lg">+</span> Add Memory
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {echoes.map((echo) => (
                  <div key={echo.id} className="group cursor-pointer">
                    <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <img
                        src={echo.img}
                        alt={echo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-center mt-2 text-sm font-medium text-slate-500 italic truncate px-2">
                      "{echo.title}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Journal History */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="size-6 text-purple-500" />
                  Recent Reflections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {history.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {emojis.find((e) => e.label === post.mood)?.char}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            {post.date}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleViewClick(post)}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                            title="View"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(post)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJournal(post.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed line-clamp-2 text-sm">
                        {post.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-slate-400 text-lg font-medium">
                  No reflections yet
                </p>
                <p className="text-slate-300 text-sm mt-1">
                  Start writing your first journal entry above!
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Modals remain the same... */}
        {/* View Modal */}
        {viewingPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {emojis.find((e) => e.label === viewingPost.mood)?.char}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {viewingPost.title}
                    </h3>
                    <p className="text-sm text-slate-400">{viewingPost.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingPost(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {viewingPost.content}
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setViewingPost(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  Edit Reflection
                </h3>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-500 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title..."
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-medium transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-500 mb-1 block">
                  Mood
                </label>
                <div className="flex gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji.label}
                      onClick={() => setEditMood(emoji.label)}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        editMood === emoji.label
                          ? `${emoji.color} ring-2 ring-blue-400 scale-110`
                          : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      {emoji.char}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-500 mb-1 block">
                  Reflection
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write your reflection..."
                  rows={6}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-medium resize-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingPost(null)}
                  className="flex-1 py-3 font-semibold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateJournal}
                  className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check className="size-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Capture This Moment
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden mb-5 bg-slate-100">
                <img
                  src={tempImage!}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="Give this moment a name..."
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 outline-none font-medium mb-6"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 font-semibold text-slate-500 hover:text-slate-700 transition-all rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewEcho}
                  className="flex-[2] bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Add to Echoes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
