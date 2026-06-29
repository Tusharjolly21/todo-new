"use client";

import { useState, useRef, useEffect } from "react";
import { useTasks } from "../state";
import { cn } from "@/lib/utils/cn";
import type { NotificationItem } from "../types";

export function NotificationsPopover({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useTasks();
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");
  const [menuOpenForId, setMenuOpenForId] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close notifications popover if clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  // Close context dots menu if clicking outside
  useEffect(() => {
    const handleMenuClickOutside = (e: MouseEvent) => {
      if (
        menuOpenForId &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpenForId(null);
      }
    };
    document.addEventListener("mousedown", handleMenuClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleMenuClickOutside);
  }, [menuOpenForId]);

  const notifications = state.notifications || [];
  const unreadList = notifications.filter((n) => !n.read);
  const readList = notifications.filter((n) => n.read);
  const currentList = activeTab === "unread" ? unreadList : readList;

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  const handleMarkRead = (id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", id });
  };

  const handleMarkAllRead = () => {
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_NOTIFICATION", id });
    setMenuOpenForId(null);
  };

  return (
    <div
      ref={popoverRef}
      className="absolute left-0 top-10 z-50 w-[380px] rounded-xl border border-neutral-200 bg-white shadow-2xl animate-pop-in text-[#202020] select-none overflow-hidden"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h4 className="text-sm font-bold text-[#202020]">Notifications</h4>
        <div className="flex gap-1.5 bg-neutral-100 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab("unread")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-md transition",
              activeTab === "unread"
                ? "bg-white text-[#202020] shadow-sm"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            Unread
            {unreadList.length > 0 && (
              <span className="ml-1 text-[9px] px-1 py-0.5 bg-neutral-200 text-neutral-700 rounded-full font-bold">
                {unreadList.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-md transition",
              activeTab === "read"
                ? "bg-white text-[#202020] shadow-sm"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            Read
          </button>
        </div>
      </div>

      {/* Mark All Read quick row */}
      {activeTab === "unread" && unreadList.length > 0 && (
        <div className="flex justify-end border-b border-neutral-50 px-4 py-2 bg-neutral-50/20">
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Main List Area */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-neutral-100">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
            {/* Bell/illustration icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-50 border border-neutral-100 text-neutral-400">
              <svg
                width="24"
                height="24"
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
              <h5 className="text-xs font-bold text-neutral-800">
                You're all caught up!
              </h5>
              <p className="text-[10px] text-neutral-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                You will see a notification here when something changes in your
                shared projects.
              </p>
            </div>
          </div>
        ) : (
          currentList.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-3 p-3 hover:bg-neutral-50/60 transition cursor-pointer relative"
            >
              {/* Green avatar with initials */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white uppercase shadow-xs">
                {item.actorName ? item.actorName.charAt(0) : "U"}
              </span>

              {/* Text Context */}
              <div className="flex-1 min-w-0 pr-12">
                <p className="text-[11px] text-neutral-800 leading-relaxed font-normal">
                  {item.text}
                </p>
                <span className="text-[9px] text-neutral-400 mt-1 block">
                  {formatDate(item.timestamp)}
                </span>
              </div>

              {/* Actions row on hover */}
              <div className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1">
                {!item.read && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-neutral-200/80 text-neutral-500 hover:text-neutral-800 transition"
                    title="Mark as read"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenForId(item.id);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-neutral-200/80 text-neutral-500 hover:text-neutral-800 transition"
                  title="More actions"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>

              {/* Individual Dots Menu */}
              {menuOpenForId === item.id && (
                <div
                  ref={menuRef}
                  className="absolute right-3 top-9 z-50 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-[#202020]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      if (item.read) {
                        dispatch({
                          type: "SET_NOTIFICATIONS_EXTERNAL",
                          notifications: notifications.map((n) =>
                            n.id === item.id ? { ...n, read: false } : n,
                          ),
                        });
                      } else {
                        handleMarkRead(item.id);
                      }
                      setMenuOpenForId(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] font-semibold hover:bg-neutral-100 text-neutral-700"
                  >
                    {item.read ? "Mark as unread" : "Mark as read"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] font-bold hover:bg-neutral-100 text-red-500"
                  >
                    Delete notification
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
