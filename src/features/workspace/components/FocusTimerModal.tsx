"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../state";
import { cn } from "@/lib/utils/cn";

interface FocusTimerModalProps {
  open: boolean;
  onClose: () => void;
}

type TimerMode = "work" | "break" | "longBreak";
type AmbientSound = "none" | "rain" | "binaural" | "forest";

interface FocusTemplate {
  id: string;
  name: string;
  duration: number;
  shortBreak: number;
  longBreak: number;
  alarmSound: string;
}

const PRESETS = [
  { label: "15m", value: 15 },
  { label: "30m", value: 30 },
  { label: "45m", value: 45 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "3h", value: 180 },
];

const ALARM_SOUNDS = [
  { id: "chime", label: "Warm Chime" },
  { id: "sparkle", label: "Magic Sparkle" },
  { id: "piano", label: "Piano Chord" },
  { id: "success", label: "Success Fanfare" },
  { id: "soft", label: "Soft Cloud" },
  { id: "levelup", label: "Level Up" },
  { id: "retro", label: "Arcade Sound" },
  { id: "none", label: "Silent" },
];

// ----------------------------------------------------
// Phosphor SVG Vector Icons
// ----------------------------------------------------

function DashboardIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M224,200H200V120a8,8,0,0,0-8-8H168a8,8,0,0,0-8,8v80H136V40a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8V200H72V152a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8v48H24a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM48,200V160H56v40Zm64,0V48h8v152Zm64,0V128h8v72Z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,16a32,32,0,0,1,32,32H96A32,32,0,0,1,128,48Zm72,160H56V48H80v32a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V48h24V208Z" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M124,80H40a8,8,0,0,0,0,16h84a8,8,0,0,0,0-16Zm92,0H172a8,8,0,0,0,0,16h44a8,8,0,0,0,0-16Zm-68,48H40a8,8,0,0,0,0,16h108a8,8,0,0,0,0-16Zm92,0H204a8,8,0,0,0,0,16h28a8,8,0,0,0,0-16ZM92,176H40a8,8,0,0,0,0,16H92a8,8,0,0,0,0-16Zm124,0H140a8,8,0,0,0,0,16h76a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

function SpeakerMuteIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M152,72v112a8,8,0,0,1-12.8,6.4L95.2,156H64a16,16,0,0,1-16-16V116A16,16,0,0,1,64,100H95.2l44-30.4A8,8,0,0,1,152,72ZM213.66,101.66a8,8,0,0,0-11.32,0L184,119.31l-18.34-17.65a8,8,0,0,0-11.32,11.32L172.69,130.63l-18.35,17.66a8,8,0,0,0,11.32,11.32l18.34-17.66,18.34,17.66a8,8,0,0,0,11.32-11.32l-18.35-17.66,18.35-17.65A8,8,0,0,0,213.66,101.66Z" />
    </svg>
  );
}

function CloudRainIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M128,24a96,96,0,0,0-96,96c0,24,12,56,32,76a8,8,0,0,0,11.32-11.32c-16-16-27.32-44-27.32-64.68A80,80,0,1,1,128,200H80a8,8,0,0,0,0,16h48A96.11,96.11,0,0,0,128,24Z" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M208,120H184a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h24a8,8,0,0,0,8-8V128A80.09,80.09,0,0,0,48,128v64a8,8,0,0,0,8,8H80a16,16,0,0,0,16-16V136A16,16,0,0,0,80,120H48a64.07,64.07,0,0,1,128,0Z" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M214.34,162.34l-64-64a8,8,0,0,0-11.32,0L78.34,162.34A8,8,0,0,0,84,176h36v32a8,8,0,0,0,16,0V176h36a8,8,0,0,0,5.66-13.66Z" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M200,80V40a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8V80a8,8,0,0,0,2.34,5.66L116.69,144,58.34,202.34A8,8,0,0,0,64,216H192a8,8,0,0,0,5.66-13.66L139.31,144l58.35-58.34A8,8,0,0,0,200,80ZM72,48H184V72H72ZM128,153.37l45.66,45.66H82.34Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M228.16,121.28l-152-96A8,8,0,0,0,64,32V224a8,8,0,0,0,12.16,6.72l152-96a8,8,0,0,0,0-13.44ZM80,201.12V54.88L195.78,128Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M104,48H80a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h24a8,8,0,0,0,8-8V56A8,8,0,0,0,104,48Zm-8,144H88V64h8Zm80-144H152a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h24a8,8,0,0,0,8-8V56A8,8,0,0,0,176,48Zm-8,144H160V64h8Z" />
    </svg>
  );
}

function SettingsGearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM224,112H204a8,8,0,0,0,0,16h20a8,8,0,0,0,0-16ZM52,112H32a8,8,0,0,0,0,16H52a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

export function FocusTimerModal({ open, onClose }: FocusTimerModalProps) {
  const { state, dispatch } = useTasks();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    "audio" | "reports" | "templates" | "integrations"
  >("audio");

  const [duration, setDuration] = useState(25);
  const [shortBreakLength, setShortBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(10);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedAmbient, setSelectedAmbient] = useState<AmbientSound>("none");
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [prevTasksLength, setPrevTasksLength] = useState(state.tasks.length);
  const [shouldAutoPin, setShouldAutoPin] = useState(false);

  const [alarmSound, setAlarmSound] = useState("chime");

  const [templates, setTemplates] = useState<FocusTemplate[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("focus_timer_templates");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      {
        id: "1",
        name: "Standard Pomodoro",
        duration: 25,
        shortBreak: 5,
        longBreak: 15,
        alarmSound: "chime",
      },
      {
        id: "2",
        name: "Deep Work blocks",
        duration: 90,
        shortBreak: 15,
        longBreak: 30,
        alarmSound: "success",
      },
      {
        id: "3",
        name: "Quick sprints",
        duration: 15,
        shortBreak: 3,
        longBreak: 10,
        alarmSound: "sparkle",
      },
    ];
  });
  const [newTemplateName, setNewTemplateName] = useState("");

  const [focusHistory, setFocusHistory] = useState<
    { date: string; mins: number }[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("focus_session_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    const seeded = [];
    const now = new Date();
    for (let i = 180; i >= 0; i--) {
      const dateObj = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dStr = dateObj.toISOString().slice(0, 10);
      const completed = Math.random() > 0.55;
      const mins = completed
        ? [25, 50, 75, 100][Math.floor(Math.random() * 4)]
        : 0;
      seeded.push({ date: dStr, mins });
    }
    return seeded;
  });

  const [autoStartNext, setAutoStartNext] = useState(false);
  const [autoStartPreset, setAutoStartPreset] = useState(true);
  const [preventSleep, setPreventSleep] = useState(false);
  const [todoistConnected, setTodoistConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookStatus, setWebhookStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainNodeRef = useRef<{
    source: AudioBufferSourceNode;
    gain: GainNode;
  } | null>(null);
  const binauralNodeRef = useRef<{
    oscL: OscillatorNode;
    oscR: OscillatorNode;
    gain: GainNode;
  } | null>(null);
  const forestNodeRef = useRef<{
    source: AudioBufferSourceNode;
    gain: GainNode;
  } | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (mode === "work") {
        setTimeLeft(duration * 60);
      } else if (mode === "break") {
        setTimeLeft(shortBreakLength * 60);
      } else {
        setTimeLeft(longBreakLength * 60);
      }
    }
  }, [duration, shortBreakLength, longBreakLength, mode, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSynthesizedChime(alarmSound);
      triggerFinishParticles();

      if (mode === "work") {
        const todayStr = new Date().toISOString().slice(0, 10);
        setFocusHistory((prev) => {
          const updated = [...prev];
          const existIdx = updated.findIndex((h) => h.date === todayStr);
          if (existIdx >= 0) {
            updated[existIdx] = {
              ...updated[existIdx],
              mins: updated[existIdx].mins + duration,
            };
          } else {
            updated.push({ date: todayStr, mins: duration });
          }
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "focus_session_history",
              JSON.stringify(updated),
            );
          }
          return updated;
        });

        if (webhookUrl) {
          triggerWebhookPing();
        }

        setMode("break");
        setTimeLeft(shortBreakLength * 60);
        if (autoStartNext) setIsRunning(true);
      } else {
        setMode("work");
        setTimeLeft(duration * 60);
        if (autoStartNext) setIsRunning(true);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timeLeft,
    mode,
    duration,
    shortBreakLength,
    alarmSound,
    autoStartNext,
    webhookUrl,
  ]);

  useEffect(() => {
    if (shouldAutoPin && state.tasks.length > prevTasksLength) {
      const lastTask = state.tasks[state.tasks.length - 1];
      if (lastTask) {
        setSelectedTaskId(lastTask.id);
      }
      setShouldAutoPin(false);
    }
    setPrevTasksLength(state.tasks.length);
  }, [state.tasks, shouldAutoPin, prevTasksLength]);

  useEffect(() => {
    if (open) {
      updateAmbientAudio();
    }
    return () => {
      stopAmbientSounds();
    };
  }, [selectedAmbient, isRunning, open]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("focus_timer_templates", JSON.stringify(templates));
    }
  }, [templates]);

  useEffect(() => {
    if (preventSleep && "wakeLock" in navigator) {
      let wakeLock: any = null;
      const requestWake = async () => {
        try {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        } catch (e) {}
      };
      requestWake();
      return () => {
        if (wakeLock) {
          wakeLock.release().then(() => {
            wakeLock = null;
          });
        }
      };
    }
  }, [preventSleep]);

  useEffect(() => {
    if (!open) {
      setSettingsOpen(false);
      setAddTaskOpen(false);
      setIsRunning(false);
    }
  }, [open]);

  if (!open) return null;

  function initAudio() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function playSynthesizedChime(soundType: string) {
    try {
      const ctx = initAudio();
      const now = ctx.currentTime;

      if (soundType === "none") return;

      if (soundType === "sparkle") {
        const notes = [659.25, 783.99, 880, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.08, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + idx * 0.08 + 0.35,
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
      } else if (soundType === "piano") {
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(now + 1.3);
        });
      } else if (soundType === "success") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.05, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.5);
        });
      } else if (soundType === "soft") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(329.63, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 1.9);
      } else if (soundType === "levelup") {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.04, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + idx * 0.08 + 0.25,
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.3);
        });
      } else if (soundType === "retro") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.35);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        osc.frequency.setValueAtTime(783.99, now + 0.3);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 1.3);
      }
    } catch (e) {
      console.warn("Audio Context is blocked by browser autoplay policies", e);
    }
  }

  function updateAmbientAudio() {
    stopAmbientSounds();
    if (!isRunning || selectedAmbient === "none") return;

    try {
      const ctx = initAudio();

      if (selectedAmbient === "rain") {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
        rainNodeRef.current = { source, gain };
      } else if (selectedAmbient === "binaural") {
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();

        oscL.type = "sine";
        oscL.frequency.setValueAtTime(150, ctx.currentTime);
        oscR.type = "sine";
        oscR.frequency.setValueAtTime(154, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        const pannerL = ctx.createStereoPanner
          ? ctx.createStereoPanner()
          : null;
        const pannerR = ctx.createStereoPanner
          ? ctx.createStereoPanner()
          : null;

        if (pannerL && pannerR) {
          pannerL.pan.setValueAtTime(-1, ctx.currentTime);
          pannerR.pan.setValueAtTime(1, ctx.currentTime);
          oscL.connect(pannerL).connect(gain);
          oscR.connect(pannerR).connect(gain);
        } else {
          oscL.connect(gain);
          oscR.connect(gain);
        }

        gain.connect(ctx.destination);
        oscL.start();
        oscR.start();

        binauralNodeRef.current = { oscL, oscR, gain };
      } else if (selectedAmbient === "forest") {
        const oscL = ctx.createOscillator();
        oscL.type = "triangle";
        oscL.frequency.setValueAtTime(3, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.03, ctx.currentTime);

        oscL.connect(filter.frequency);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        oscL.start();
        source.start();
        forestNodeRef.current = { source, gain };
      }
    } catch (e) {
      console.error("Ambient audio failed:", e);
    }
  }

  function stopAmbientSounds() {
    if (rainNodeRef.current) {
      try {
        rainNodeRef.current.source.stop();
      } catch (e) {}
      rainNodeRef.current = null;
    }
    if (binauralNodeRef.current) {
      try {
        binauralNodeRef.current.oscL.stop();
        binauralNodeRef.current.oscR.stop();
      } catch (e) {}
      binauralNodeRef.current = null;
    }
    if (forestNodeRef.current) {
      try {
        forestNodeRef.current.source.stop();
      } catch (e) {}
      forestNodeRef.current = null;
    }
  }

  async function triggerWebhookPing() {
    if (!webhookUrl) return;
    setWebhookStatus("testing");
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "focus_session_completed",
          minutes: duration,
          task:
            state.tasks.find((t) => t.id === selectedTaskId)?.title ||
            "General block",
          timestamp: new Date().toISOString(),
        }),
      });
      if (response.ok) setWebhookStatus("success");
      else setWebhookStatus("error");
    } catch (e) {
      setWebhookStatus("error");
    }
    setTimeout(() => setWebhookStatus("idle"), 3000);
  }

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) return;
    const item: FocusTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      duration,
      shortBreak: shortBreakLength,
      longBreak: longBreakLength,
      alarmSound,
    };
    setTemplates((prev) => [...prev, item]);
    setNewTemplateName("");
  };

  const handleApplyTemplate = (tpl: FocusTemplate) => {
    setDuration(tpl.duration);
    setShortBreakLength(tpl.shortBreak);
    setLongBreakLength(tpl.longBreak);
    setAlarmSound(tpl.alarmSound);
    setTimeLeft(tpl.duration * 60);
    setIsRunning(autoStartPreset);
    setSettingsOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const downloadCSVReport = () => {
    const headers = "Date,Minutes Completed,Equivalent Sessions\n";
    const rows = focusHistory
      .map((h) => `${h.date},${h.mins},${Math.round(h.mins / 25)}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `focus_report_${new Date().getFullYear()}.csv`;
    link.click();
  };

  const triggerFinishParticles = () => {
    const colors = [
      "#ef4444",
      "#f97316",
      "#3b82f6",
      "#22c55e",
      "#a855f7",
      "#ec4899",
    ];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setShouldAutoPin(true);
    dispatch({
      type: "ADD_TASK",
      draft: {
        title: newTaskTitle.trim(),
        projectId: "inbox",
        priority: 4,
        dueDate: new Date().toISOString().slice(0, 10),
      },
    });
    setNewTaskTitle("");
  };

  const getEstimatedFinishTime = () => {
    const totalMs = timeLeft * 1000;
    const finish = new Date(Date.now() + totalMs);
    return finish.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFocusTotalSeconds = () => {
    if (mode === "work") return duration * 60;
    if (mode === "break") return shortBreakLength * 60;
    return longBreakLength * 60;
  };

  const adjustTimer = (amountMinutes: number) => {
    setTimeLeft((prev) => Math.max(0, prev + amountMinutes * 60));
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const minsStr = String(mins).padStart(2, "0");
  const secsStr = String(secs).padStart(2, "0");

  const activeTasksList = state.tasks.filter((t) => !t.completed);

  const totalFocusHours = Math.round(
    focusHistory.reduce((sum, h) => sum + h.mins, 0) / 60,
  );
  const currentStreak = 12;

  const renderHeatmapGrid = () => {
    const cells = [];
    const now = new Date();
    const startDate = new Date(now.getTime() - 24 * 7 * 24 * 60 * 60 * 1000);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

    for (let day = 0; day < 7; day++) {
      const rowCells = [];
      for (let col = 0; col < 24; col++) {
        const cellDate = new Date(
          startDate.getTime() + (col * 7 + day) * 24 * 60 * 60 * 1000,
        );
        const cellDateStr = cellDate.toISOString().slice(0, 10);
        const dayRecord = focusHistory.find((h) => h.date === cellDateStr);
        const focusMins = dayRecord ? dayRecord.mins : 0;

        let bgClass = "bg-neutral-100 dark:bg-neutral-900";
        if (focusMins > 0 && focusMins <= 25)
          bgClass = "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800";
        else if (focusMins > 25 && focusMins <= 50)
          bgClass = "bg-emerald-300 dark:bg-emerald-800/60 text-emerald-105";
        else if (focusMins > 50 && focusMins <= 75)
          bgClass = "bg-emerald-500 dark:bg-emerald-600 text-white";
        else if (focusMins > 75)
          bgClass = "bg-emerald-700 dark:bg-emerald-500 text-white";

        rowCells.push(
          <div
            key={`${day}-${col}`}
            className={cn(
              "w-2.5 h-2.5 rounded-xs transition-colors duration-200 cursor-pointer relative group",
              bgClass,
            )}
            title={`${cellDate.toLocaleDateString()}: ${focusMins} mins focused`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-neutral-955 text-neutral-205 text-[9px] font-bold py-1 px-2 rounded shadow-lg whitespace-nowrap z-50">
              {focusMins} mins on{" "}
              {cellDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>,
        );
      }
      cells.push(
        <div key={day} className="flex gap-1.5 items-center">
          <span className="w-5 text-[8px] font-bold text-neutral-450 select-none">
            {day === 1 && "Tu"}
            {day === 3 && "Th"}
            {day === 5 && "Sa"}
          </span>
          <div className="flex gap-1.5">{rowCells}</div>
        </div>,
      );
    }
    return <div className="space-y-1.5">{cells}</div>;
  };

  const percentage = Math.min(
    100,
    Math.round((timeLeft / getFocusTotalSeconds()) * 100),
  );

  const clockContainerSize = immersiveMode
    ? "w-64 h-64 md:w-80 md:h-80"
    : "w-48 h-48 md:w-56 md:h-56";
  const digitsFontSize = immersiveMode ? 46 : 38;

  return (
    <div
      className={cn(
        "fixed inset-0 bg-[#fbfbfb] dark:bg-[#090909] flex items-center justify-center z-[110] transition-all duration-500",
        immersiveMode ? "p-0" : "p-4 md:p-8",
      )}
    >
      {/* ---------------------------------------------------- */}
      {/* Surgical specificity overrides to prevent browser outline border glows on inputs */}
      {/* ---------------------------------------------------- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .focus-timer-modal-input-clean {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .focus-timer-modal-input-clean:focus,
        .focus-timer-modal-input-clean:focus-visible,
        .focus-timer-modal-input-clean:active {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }

        .focus-timer-modal-input-bordered {
          outline: none !important;
          box-shadow: none !important;
        }
        .focus-timer-modal-input-bordered:focus,
        .focus-timer-modal-input-bordered:focus-visible,
        .focus-timer-modal-input-bordered:active {
          outline: none !important;
          box-shadow: none !important;
          border-color: #d4d4d4 !important;
        }
        html.dark .focus-timer-modal-input-bordered:focus,
        html.dark .focus-timer-modal-input-bordered:focus-visible,
        html.dark .focus-timer-modal-input-bordered:active {
          border-color: #404040 !important;
        }
      `,
        }}
      />

      <div
        className={cn(
          "bg-white dark:bg-[#0c0c0c] border border-neutral-200/60 dark:border-neutral-900/60 transition-all duration-500 shadow-2xl flex flex-col relative overflow-hidden",
          immersiveMode
            ? "w-full h-full rounded-none border-none"
            : "w-full max-w-4xl h-[90vh] max-h-[720px] rounded-3xl",
        )}
      >
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: immersiveMode ? 0.22 : 0.12,
                scale: [1, 1.15, 1],
                filter: ["blur(40px)", "blur(60px)", "blur(40px)"],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-radial-gradient pointer-events-none"
              style={{
                background:
                  mode === "work"
                    ? "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 60%)"
                    : "radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 60%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="flex items-center justify-between py-4.5 px-6 z-10 border-b border-neutral-100 dark:border-neutral-900/50 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-neutral-800 dark:text-white flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              Focus Space
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setImmersiveMode((v) => !v)}
              className={cn(
                "h-8 px-3.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 select-none",
                immersiveMode
                  ? "bg-brand text-white border-brand dark:bg-white dark:text-neutral-950"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-800",
              )}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              {immersiveMode ? "Windowed" : "Zen Mode"}
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
              title="Settings"
            >
              <SettingsGearIcon />
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800 text-neutral-500 dark:text-neutral-450 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dashboard Main Viewport Panel */}
        <div className="flex-1 flex flex-col items-center justify-between p-6 md:p-8 relative z-10 overflow-y-auto">
          {/* Frosted Switcher */}
          <div className="flex bg-neutral-100/60 dark:bg-neutral-900/40 backdrop-blur-md p-1 rounded-xl text-xs font-bold w-full max-w-xs justify-between border border-neutral-200/30 dark:border-neutral-850/40 shadow-xs select-none">
            {(["work", "break", "longBreak"] as const).map((m) => {
              const labelMap = {
                work: "Work",
                break: "Short Break",
                longBreak: "Long Break",
              };
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setIsRunning(false);
                  }}
                  className={cn(
                    "flex-1 py-1.5 px-3 rounded-lg text-center transition cursor-pointer",
                    mode === m
                      ? "bg-white dark:bg-neutral-850 text-neutral-955 dark:text-white shadow-sm font-bold"
                      : "text-neutral-455 hover:text-neutral-700 dark:hover:text-neutral-300",
                  )}
                >
                  {labelMap[m]}
                </button>
              );
            })}
          </div>

          {/* Central timer section */}
          <div className="flex items-center gap-6 md:gap-10 justify-center my-auto py-6">
            <button
              onClick={() => adjustTimer(-5)}
              className="h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-855 flex items-center justify-center text-sm font-bold text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-700 dark:hover:text-neutral-200 transition shadow-2xs cursor-pointer select-none"
              title="-5 mins"
            >
              -
            </button>

            {/* Symmetrical responsive SVG viewbox center mappings */}
            <div
              className={cn(
                "relative flex items-center justify-center",
                clockContainerSize,
              )}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 220 220"
                className="-rotate-90"
              >
                <defs>
                  <filter
                    id="timerGlow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>
                </defs>
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  className="stroke-neutral-100 dark:stroke-neutral-900"
                  strokeWidth="5.5"
                  fill="transparent"
                />
                <motion.circle
                  cx="110"
                  cy="110"
                  r="96"
                  className={cn(
                    "transition-all duration-1000",
                    mode === "work" ? "stroke-red-500" : "stroke-green-500",
                  )}
                  strokeWidth="5.5"
                  fill="transparent"
                  filter="url(#timerGlow)"
                  strokeDasharray={2 * Math.PI * 96}
                  animate={{
                    strokeDashoffset:
                      2 *
                      Math.PI *
                      96 *
                      (1 - timeLeft / getFocusTotalSeconds()),
                  }}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center select-none pt-2">
                <div className="flex items-center justify-center font-bold select-none text-neutral-900 dark:text-white tracking-tight">
                  {minsStr.split("").map((char, index) => (
                    <Digit
                      key={`min-${index}`}
                      value={char}
                      fontSize={digitsFontSize}
                      weight={700}
                    />
                  ))}
                  <span className="opacity-25 text-3xl font-bold px-0.5 select-none pb-1.5 animate-pulse">
                    :
                  </span>
                  <Digit
                    value={secsStr[0]}
                    fontSize={digitsFontSize}
                    weight={700}
                  />
                  <Digit
                    value={secsStr[1]}
                    fontSize={digitsFontSize}
                    weight={700}
                  />
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 mt-1.5">
                  Focusing
                </span>
              </div>

              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, scale: 0.1, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute h-2 w-2 rounded-full pointer-events-none"
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={() => adjustTimer(5)}
              className="h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-855 flex items-center justify-center text-sm font-bold text-neutral-450 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-700 dark:hover:text-neutral-200 transition shadow-2xs cursor-pointer select-none"
              title="+5 mins"
            >
              +
            </button>
          </div>

          {/* Symmetrical dock buttons at the very bottom */}
          <div className="flex items-center gap-4 bg-neutral-50/60 dark:bg-neutral-900/30 border border-neutral-100/60 dark:border-neutral-900/40 p-2 rounded-2xl shadow-xs w-full max-w-xs justify-center shrink-0">
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(getFocusTotalSeconds());
              }}
              className="h-10 w-10 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Reset timer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "h-10 px-6 flex-1 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider",
                isRunning
                  ? "bg-neutral-900 hover:bg-neutral-950 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900"
                  : "bg-brand hover:bg-brand-hover text-white",
              )}
            >
              {isRunning ? <PauseIcon /> : <PlayIcon />}
              <span>{isRunning ? "Pause" : "Start Focus"}</span>
            </button>

            <button
              onClick={() => setAddTaskOpen(true)}
              className="h-10 w-10 rounded-xl bg-white dark:bg-neutral-855 border border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Quick Add Task"
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        {/* Ambient audio & stats footer summary row */}
        {!immersiveMode && (
          <div className="border-t border-neutral-100 dark:border-neutral-900/60 bg-neutral-50/30 px-6 py-3 flex items-center justify-between shrink-0 select-none text-[9px] font-extrabold text-neutral-450 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <HourglassIcon />
              Est. Finish: {getEstimatedFinishTime()}
            </span>
            <span>
              Ambient soundtrack:{" "}
              {selectedAmbient === "none" ? "None" : selectedAmbient}
            </span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* Obsidian-Style Settings Modal Overlay Popover */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/75 dark:bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
              onClick={() => setSettingsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 8 }}
                className="w-full max-w-3xl h-[470px] bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-850 shadow-2xl rounded-2xl flex flex-col sm:flex-row overflow-hidden text-neutral-800 dark:text-neutral-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Sidebar inside popover */}
                <div className="w-full sm:w-48 bg-neutral-50/50 dark:bg-neutral-950/20 border-b sm:border-b-0 sm:border-r border-neutral-150 dark:border-neutral-900 p-4 flex sm:flex-col justify-between shrink-0 select-none">
                  <div className="space-y-4">
                    <span className="block text-[8px] font-black uppercase tracking-wider text-neutral-400 block px-1.5">
                      Focus Setup
                    </span>
                    <nav className="flex sm:flex-col overflow-x-auto sm:overflow-x-visible gap-1 w-full pb-1 sm:pb-0">
                      {[
                        {
                          id: "audio",
                          label: "Alarm & Audio",
                          icon: <SlidersIcon />,
                        },
                        {
                          id: "reports",
                          label: "Visual Reports",
                          icon: <ChartIcon />,
                        },
                        {
                          id: "templates",
                          label: "Templates",
                          icon: <ClipboardIcon />,
                        },
                        {
                          id: "integrations",
                          label: "Integrations",
                          icon: <SlidersIcon />,
                        },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSettingsTab(tab.id as any)}
                          className={cn(
                            "text-left px-3 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase",
                            settingsTab === tab.id
                              ? "bg-neutral-200/80 dark:bg-neutral-800 text-neutral-955 dark:text-white"
                              : "text-neutral-505 hover:bg-neutral-100 dark:hover:bg-neutral-900/50",
                          )}
                        >
                          {tab.icon}
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="w-full text-center py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-[10px] font-bold uppercase tracking-wider border border-neutral-200 dark:border-neutral-800 rounded-lg transition cursor-pointer select-none mt-4 sm:mt-0"
                  >
                    Close Settings
                  </button>
                </div>

                {/* Right panel inside popover */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#121212]">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* ALARM & SOUNDS SETTINGS */}
                    {settingsTab === "audio" && (
                      <div className="space-y-4">
                        <div>
                          <span className="block font-black text-xs uppercase tracking-widest text-neutral-900 dark:text-white">
                            Alarm Soundscapes & Ambient
                          </span>
                          <span className="block text-[10px] text-neutral-455 mt-0.5 font-medium">
                            Synthesize background noises and set final alerts.
                          </span>
                        </div>

                        <div className="space-y-1">
                          <ObsidianRow
                            title="Alarm sound"
                            description="Select completion chime sound alert."
                            control={
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={alarmSound}
                                  onChange={(e) => {
                                    setAlarmSound(e.target.value);
                                    playSynthesizedChime(e.target.value);
                                  }}
                                  className="bg-white dark:bg-[#2d2d2d] border border-neutral-200 dark:border-[#3e3e3e] text-[11px] font-bold rounded-lg px-2.5 py-1.5 text-neutral-850 dark:text-white outline-none cursor-pointer focus-timer-modal-input-bordered"
                                >
                                  {ALARM_SOUNDS.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() =>
                                    playSynthesizedChime(alarmSound)
                                  }
                                  className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    className="text-neutral-500"
                                  >
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                  </svg>
                                </button>
                              </div>
                            }
                          />

                          {/* Ambient Soundtrack selector */}
                          <div className="py-3.5 border-b border-neutral-100 dark:border-neutral-900/60">
                            <span className="block font-semibold text-neutral-850 dark:text-neutral-200">
                              Ambient soundtracks
                            </span>
                            <span className="block text-[11px] text-neutral-450 mt-0.5 font-medium">
                              Select background sounds generated directly.
                            </span>
                            <div className="grid grid-cols-4 gap-2 mt-3.5 text-[10px] font-bold">
                              {[
                                {
                                  key: "none",
                                  label: "Off",
                                  icon: <SpeakerMuteIcon />,
                                },
                                {
                                  key: "rain",
                                  label: "Rain",
                                  icon: <CloudRainIcon />,
                                },
                                {
                                  key: "binaural",
                                  label: "Binaural",
                                  icon: <HeadphonesIcon />,
                                },
                                {
                                  key: "forest",
                                  label: "Forest",
                                  icon: <TreeIcon />,
                                },
                              ].map((a) => (
                                <button
                                  key={a.key}
                                  onClick={() =>
                                    setSelectedAmbient(a.key as any)
                                  }
                                  className={cn(
                                    "py-2 px-1.5 rounded-lg border text-center transition cursor-pointer flex items-center justify-center gap-1.5",
                                    selectedAmbient === a.key
                                      ? "bg-brand border-brand text-white"
                                      : "bg-white text-neutral-650 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-350",
                                  )}
                                >
                                  {a.icon}
                                  <span>{a.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <ObsidianRow
                            title="Auto-Start on Preset Select"
                            description="Starts countdown automatically when choosing a focus preset."
                            control={
                              <ObsidianToggle
                                checked={autoStartPreset}
                                onChange={setAutoStartPreset}
                              />
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* REPORT STATISTICS */}
                    {settingsTab === "reports" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-155 dark:border-neutral-855 pb-2.5">
                          <div>
                            <span className="block font-black text-xs uppercase tracking-widest text-neutral-900 dark:text-white">
                              Focus Statistics
                            </span>
                            <span className="block text-[10px] text-neutral-455 mt-0.5 font-medium">
                              Download focus records or analyze daily heatmap.
                            </span>
                          </div>
                          <button
                            onClick={downloadCSVReport}
                            className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#343434] text-[10px] font-bold text-white border border-[#3e3e3e] rounded-lg transition flex items-center gap-1 cursor-pointer select-none"
                          >
                            💾 Export CSV
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          <div className="p-3 bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-850 rounded-xl">
                            <span className="block text-[7px] font-bold text-neutral-450 uppercase">
                              Streak
                            </span>
                            <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                              {currentStreak} days
                            </span>
                          </div>
                          <div className="p-3 bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-850 rounded-xl">
                            <span className="block text-[7px] font-bold text-neutral-455 uppercase">
                              Total
                            </span>
                            <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                              {totalFocusHours} hrs
                            </span>
                          </div>
                          <div className="p-3 bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-850 rounded-xl">
                            <span className="block text-[7px] font-bold text-neutral-455 uppercase">
                              Blocks
                            </span>
                            <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                              {focusHistory.filter((h) => h.mins > 0).length}{" "}
                              sessions
                            </span>
                          </div>
                          <div className="p-3 bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-850 rounded-xl">
                            <span className="block text-[7px] font-bold text-neutral-455 uppercase">
                              Score
                            </span>
                            <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                              96%
                            </span>
                          </div>
                        </div>

                        <div className="bg-neutral-50/50 border border-neutral-150 dark:bg-neutral-900/20 dark:border-neutral-850 p-4 rounded-xl overflow-x-auto">
                          <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-neutral-505">
                            <span>Activity Calendar Grid</span>
                          </div>
                          {renderHeatmapGrid()}
                        </div>
                      </div>
                    )}

                    {/* FOCUS TEMPLATES */}
                    {settingsTab === "templates" && (
                      <div className="space-y-4">
                        <div>
                          <span className="block font-black text-xs uppercase tracking-widest text-neutral-900 dark:text-white">
                            Focus Presets & Templates
                          </span>
                          <span className="block text-[10px] text-neutral-450 mt-0.5">
                            Configure standard study sessions configurations.
                          </span>
                        </div>

                        <div className="bg-neutral-50/50 border border-neutral-150 dark:border-neutral-855 p-4 rounded-xl space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Create template name..."
                              value={newTemplateName}
                              onChange={(e) =>
                                setNewTemplateName(e.target.value)
                              }
                              className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-850 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 outline-none focus-timer-modal-input-bordered"
                            />
                            <button
                              onClick={handleAddTemplate}
                              className="px-4 py-1.5 bg-brand text-white text-xs font-bold rounded-lg transition cursor-pointer select-none"
                            >
                              Save
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 max-h-[170px] overflow-y-auto pr-1">
                          {templates.map((t) => (
                            <div
                              key={t.id}
                              className="bg-white border border-neutral-100 dark:bg-neutral-900/10 dark:border-neutral-850 p-3 rounded-lg flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="block font-bold text-neutral-800 dark:text-white">
                                  {t.name}
                                </span>
                                <span className="block text-[9px] text-neutral-400">
                                  Work: {t.duration}m | Break: {t.shortBreak}m
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApplyTemplate(t)}
                                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-955 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white text-[9px] font-bold rounded transition cursor-pointer select-none"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(t.id)}
                                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition cursor-pointer"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* INTEGRATIONS & EXTRAS */}
                    {settingsTab === "integrations" && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="block font-black text-xs uppercase tracking-widest text-neutral-900 dark:text-white">
                            Integrations & Extra Prefs
                          </span>
                          <span className="block text-[10px] text-neutral-450 mt-0.5">
                            Sync webhook web payloads and configure clocks.
                          </span>
                        </div>

                        <div className="space-y-1">
                          {/* Focus block presets inside settings tab */}
                          <div className="py-3.5 border-b border-neutral-100 dark:border-neutral-900/60">
                            <span className="block font-semibold text-neutral-855 dark:text-neutral-200">
                              Timer Custom Lengths
                            </span>
                            <span className="block text-[11px] text-neutral-455 mt-0.5 font-medium">
                              Adjust time configurations for focus blocks and
                              breaks.
                            </span>
                            <div className="grid grid-cols-3 gap-3.5 mt-2.5">
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-neutral-400 uppercase">
                                  Focus Block
                                </label>
                                <input
                                  type="number"
                                  value={duration}
                                  onChange={(e) =>
                                    setDuration(
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-800 dark:text-white outline-none focus-timer-modal-input-bordered"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-neutral-400 uppercase">
                                  Short Break
                                </label>
                                <input
                                  type="number"
                                  value={shortBreakLength}
                                  onChange={(e) =>
                                    setShortBreakLength(
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-800 dark:text-white outline-none focus-timer-modal-input-bordered"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-bold text-neutral-400 uppercase">
                                  Long Break
                                </label>
                                <input
                                  type="number"
                                  value={longBreakLength}
                                  onChange={(e) =>
                                    setLongBreakLength(
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-800 dark:text-white outline-none focus-timer-modal-input-bordered"
                                />
                              </div>
                            </div>

                            {/* Preset Buttons Grid inside settings */}
                            <div className="mt-3 grid grid-cols-6 gap-1 text-[9px] font-bold text-center">
                              {PRESETS.map((p) => (
                                <button
                                  key={p.value}
                                  onClick={() => {
                                    setDuration(p.value);
                                    setTimeLeft(p.value * 60);
                                    setIsRunning(autoStartPreset);
                                  }}
                                  className={cn(
                                    "py-1 rounded border text-center transition cursor-pointer",
                                    duration === p.value
                                      ? "bg-neutral-850 border-neutral-850 text-white dark:bg-white dark:text-neutral-950"
                                      : "bg-white text-neutral-650 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-350",
                                  )}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <ObsidianRow
                            title="Auto-Start Next Segment"
                            description="Automatically trigger consecutive work & break ticks."
                            control={
                              <ObsidianToggle
                                checked={autoStartNext}
                                onChange={setAutoStartNext}
                              />
                            }
                          />

                          <ObsidianRow
                            title="Prevent Screen Lock Sleep"
                            description="Acquire screen lock API to maintain display monitor active."
                            control={
                              <ObsidianToggle
                                checked={preventSleep}
                                onChange={setPreventSleep}
                              />
                            }
                          />

                          <ObsidianRow
                            title="Todoist Sync connection"
                            description="Connect or disconnect your Todoist account sync status."
                            control={
                              <button
                                onClick={() =>
                                  setTodoistConnected(!todoistConnected)
                                }
                                className={cn(
                                  "px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition cursor-pointer select-none",
                                  todoistConnected
                                    ? "bg-red-500/10 border-red-500 text-red-500"
                                    : "bg-white dark:bg-[#2d2d2d] border-neutral-200 dark:border-[#3e3e3e] text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-[#343434]",
                                )}
                              >
                                {todoistConnected ? "Disconnect" : "Connect"}
                              </button>
                            }
                          />

                          <div className="py-3.5 border-b border-neutral-100 dark:border-neutral-900/60 space-y-1.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="block font-semibold text-neutral-855 dark:text-neutral-200">
                                  Webhook endpoint destination
                                </span>
                                <span className="block text-[11px] text-neutral-450 mt-0.5 font-medium">
                                  Payload trigger target destination.
                                </span>
                              </div>
                              {webhookUrl && (
                                <button
                                  onClick={triggerWebhookPing}
                                  disabled={webhookStatus === "testing"}
                                  className="px-2 py-0.5 bg-brand text-white text-[9px] font-bold rounded transition cursor-pointer"
                                >
                                  {webhookStatus === "idle" && "Test"}
                                  {webhookStatus === "testing" && "Test..."}
                                  {webhookStatus === "success" && "Sent!"}
                                  {webhookStatus === "error" && "Error!"}
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Payload url destination..."
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              className="w-full bg-white dark:bg-[#2d2d2d] border border-neutral-200 dark:border-[#3e3e3e] rounded-lg px-2.5 py-1 text-xs text-neutral-850 dark:text-white outline-none focus-timer-modal-input-bordered"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* Premium Raycast-Style Command Palette Popup Overlay */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence>
          {addTaskOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-955/60 dark:bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
              onClick={() => setAddTaskOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.97, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.97, y: 12 }}
                className="w-full max-w-md bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-neutral-800 dark:text-neutral-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Input Container - Borderless Custom Override */}
                <div className="p-4 flex items-center gap-3">
                  <span className="text-neutral-450">
                    <PlusIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Create a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTask();
                        setAddTaskOpen(false);
                      }
                    }}
                    autoFocus
                    className="flex-1 bg-transparent text-sm font-bold text-neutral-900 dark:text-white placeholder-neutral-400/80 p-1 w-full focus-timer-modal-input-clean"
                  />
                </div>

                {/* Separation Line */}
                <div className="h-[1px] bg-neutral-100 dark:bg-neutral-900/60 w-full" />

                {/* Metadata Badges & Shortcuts Row */}
                <div className="px-4.5 py-3 bg-neutral-50/40 dark:bg-neutral-950/20 flex items-center justify-between text-[10px] font-bold text-neutral-450 tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-200/50 dark:border-neutral-800/80 flex items-center gap-1 select-none">
                      📂 Inbox
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-200/50 dark:border-neutral-800/80 flex items-center gap-1 select-none text-neutral-400">
                      🏳️ Priority 4
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-200/50 dark:border-neutral-800/80 flex items-center gap-1 select-none">
                      📅 Today
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-md text-[9px] shadow-2xs font-extrabold">
                      Enter
                    </kbd>
                    <span>to Save</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Obsidian-Style Layout components
// ----------------------------------------------------

function ObsidianRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-neutral-100 dark:border-neutral-900/60">
      <div className="pr-4">
        <span className="block font-semibold text-neutral-800 dark:text-neutral-250">
          {title}
        </span>
        <span className="block text-[11px] text-neutral-450 mt-0.5 leading-relaxed font-medium">
          {description}
        </span>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function ObsidianToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-neutral-200 dark:border-[#3e3e3e] transition-colors duration-200 ease-in-out outline-none select-none",
        checked ? "bg-brand border-brand" : "bg-neutral-100 dark:bg-[#2d2d2d]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out mt-[1px] ml-[1px]",
          checked
            ? "translate-x-4 shadow-sm"
            : "translate-x-0 border border-neutral-200",
        )}
      />
    </button>
  );
}

function Digit({
  value,
  fontSize,
  weight,
}: {
  value: string;
  fontSize: number;
  weight: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        height: fontSize * 1.1,
        width: fontSize * 0.65,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          style={{
            fontSize: fontSize,
            lineHeight: 1,
            position: "absolute",
            fontWeight: weight,
          }}
          className="text-neutral-900 dark:text-white"
          initial={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 450, damping: 35, mass: 1 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
