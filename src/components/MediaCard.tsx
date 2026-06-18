import React from "react";
import type { MediaItem } from "../data/mediaData";

interface Props {
  item: MediaItem;
}

export const MediaCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
          {item.duration}
        </span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
            {item.type}
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 line-clamp-2">
          {item.title}
        </h3>
      </div>
    </div>
  );
};
