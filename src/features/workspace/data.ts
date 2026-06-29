import { addDays, startOfToday, toISO } from "./date";
import type { Task } from "./types";

const today = startOfToday();

/** Seed tasks for the demo, spread across a few projects. */
export const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Add your first task",
    description: "Anything on your mind — type it here to get started.",
    projectId: "inbox",
    dueDate: toISO(today),
    priority: 1,
    completed: false,
  },
  {
    id: "t2",
    title: "Plan my week",
    description: "Block focus time on the calendar",
    projectId: "inbox",
    dueDate: toISO(addDays(today, 1)),
    priority: 4,
    completed: false,
  },
  {
    id: "t3",
    title: "Read a chapter of my book",
    projectId: "inbox",
    dueDate: toISO(addDays(today, 3)),
    priority: 4,
    completed: false,
  },
  {
    id: "t4",
    title: "Buy groceries",
    projectId: "home",
    dueDate: toISO(addDays(today, 16)),
    priority: 1,
    completed: false,
  },
  {
    id: "t5",
    title: "Prepare sprint review deck",
    description: "Highlights, metrics, next steps",
    projectId: "my-work",
    dueDate: toISO(addDays(today, 2)),
    priority: 2,
    completed: false,
  },
  {
    id: "t6",
    title: "Reply to design feedback",
    projectId: "my-work",
    dueDate: toISO(today),
    priority: 3,
    completed: false,
  },
  {
    id: "t7",
    title: "Water the plants",
    projectId: "home",
    dueDate: null,
    priority: 4,
    completed: false,
  },
];
