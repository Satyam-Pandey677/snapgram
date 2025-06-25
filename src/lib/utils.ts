import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function timeAgo(timestamp: string=""): string {
  const now: Date = new Date();
  const past: Date = new Date(timestamp);
  const diff: number = Math.floor((now.getTime() - past.getTime()) / 1000); // Difference in seconds

  const units: { label: string; seconds: number }[] = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
      const count: number = Math.floor(diff / unit.seconds);
      if (count >= 1) {
          return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
      }
  }

  return "Just now";
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};