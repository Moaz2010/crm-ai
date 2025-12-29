export interface Task {
  id: number;
  text: string;
  description?: string;
  done: boolean;
  dueDate?: string; // ISO string
  priority?: "low" | "medium" | "high";
}

const STORAGE_KEY = "lead_capture_tasks";

export class TaskService {
  static getTasks(): Task[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Return some default tasks if empty
      const defaultTasks: Task[] = [
        {
          id: 1,
          text: "Call new leads",
          done: false,
          priority: "high",
          dueDate: new Date().toISOString(),
        },
        { id: 2, text: "Review pipeline", done: true, priority: "medium" },
        { id: 3, text: "Update website content", done: false, priority: "low" },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
      return defaultTasks;
    }
    return JSON.parse(data);
  }

  static saveTask(task: Task): Task {
    const tasks = this.getTasks();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);

    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.unshift(task);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return task;
  }

  static deleteTask(id: number): void {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  static toggleTask(id: number): Task | undefined {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
      this.saveTask(task);
      return task;
    }
    return undefined;
  }
}
