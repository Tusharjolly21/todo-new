"use client";

import { useState } from "react";
import { useTasks } from "../state";
import { cn } from "@/lib/utils/cn";

export function NotificationsView() {
  const { state, dispatch } = useTasks();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");

  const notifications = state.notifications || [];
  const unreadList = notifications.filter((n) => !n.read);
  const readList = notifications.filter((n) => n.read);
  const currentList = activeTab === "unread" ? unreadList : notifications;

  const handleMarkRead = (id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", id });
  };

  const handleMarkAllRead = () => {
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  };

  // Prettify timestamp relative to current time
  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const formatNotificationText = (text: string) => {
    if (text.includes("Nicelydone") && text.includes("Business plan")) {
      return (
        <span className="text-sm text-neutral-800 leading-snug">
          <span className="font-bold text-neutral-900">Nicelydone</span> is now
          on <span className="font-bold text-neutral-900">Business plan</span>
        </span>
      );
    }
    return (
      <span className="text-sm text-neutral-800 leading-snug">{text}</span>
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-10 select-none animate-fade-up">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
          Notifications
        </h1>
        {unreadList.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition active:scale-95"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" />
            </svg>
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border",
            activeTab === "all"
              ? "bg-[#202020] text-white border-[#202020]"
              : "bg-white text-neutral-500 hover:text-neutral-800 border-neutral-200",
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border",
            activeTab === "unread"
              ? "bg-[#202020] text-white border-[#202020]"
              : "bg-white text-neutral-500 hover:text-neutral-800 border-neutral-200",
          )}
        >
          Unread
          {unreadList.length > 0 && (
            <span
              className={cn(
                "text-[9px] px-1.5 py-0.5 rounded-full font-extrabold leading-none",
                activeTab === "unread"
                  ? "bg-white/25 text-white"
                  : "bg-neutral-100 text-neutral-600 border border-neutral-200",
              )}
            >
              {unreadList.length}
            </span>
          )}
        </button>
      </div>

      {/* Notification items Container */}
      <div className="border border-neutral-200/60 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-neutral-100">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 border border-neutral-100 text-neutral-400">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-800">
                You're all caught up!
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                You will see a notification here when something changes in your
                shared projects.
              </p>
            </div>
          </div>
        ) : (
          currentList.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-start gap-4 p-4 hover:bg-neutral-50/50 transition cursor-pointer relative",
                !item.read
                  ? "border-l-[3px] border-brand bg-neutral-50/30"
                  : "border-l-[3px] border-transparent",
              )}
            >
              {/* Pink workspace avatar icon with bottom right check label */}
              <div className="relative shrink-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d6409f] text-sm font-extrabold text-white uppercase shadow-xs">
                  {item.actorName ? item.actorName.charAt(0) : "N"}
                </span>
                <span className="absolute -bottom-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded bg-blue-500 text-[8px] text-white font-extrabold border border-white">
                  ✓
                </span>
              </div>

              {/* Notification description content */}
              <div className="flex-1 min-w-0 pr-12">
                {formatNotificationText(item.text)}
                <span className="text-[10px] text-neutral-400 mt-1 block font-medium">
                  {getRelativeTime(item.timestamp)}
                </span>
              </div>

              {/* Hollow mark-as-read checkbox button */}
              {!item.read && (
                <button
                  onClick={() => handleMarkRead(item.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-300 hover:border-brand hover:bg-red-50 text-transparent hover:text-brand transition shrink-0 self-center"
                  title="Mark as read"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
