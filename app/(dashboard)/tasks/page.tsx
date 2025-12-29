'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

interface Task {
  id: string;
  title: string;
  description?: string;
  type: string;
  priority: string;
  status: string;
  due_date?: string;
  created_at: string;
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const typeIcons: Record<string, React.ReactNode> = {
  follow_up: <Clock className="w-4 h-4" />,
  call: <AlertCircle className="w-4 h-4" />,
  email: <Calendar className="w-4 h-4" />,
  task: <CheckCircle2 className="w-4 h-4" />,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    due_date: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (data) setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: newTask.title,
          description: newTask.description || null,
          type: newTask.type,
          priority: newTask.priority,
          status: 'pending',
          due_date: newTask.due_date || null,
        })
        .select()
        .single();

      if (data) {
        setTasks([data, ...tasks]);
        setIsDialogOpen(false);
        setNewTask({
          title: '',
          description: '',
          type: 'task',
          priority: 'medium',
          due_date: '',
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const supabase = createClient();
      await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && task.status === 'pending') ||
      (filter === 'in_progress' && task.status === 'in_progress') ||
      (filter === 'completed' && task.status === 'completed');
    
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your tasks and stay on top of your work
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Task title" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Task description" 
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newTask.type} onValueChange={(v) => setNewTask({ ...newTask, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createTask} disabled={saving || !newTask.title.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTasks.length > 0 ? filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  task.status === 'completed'
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Checkbox
                  checked={task.status === 'completed'}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium ${
                        task.status === 'completed'
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <Badge
                      className={priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}
                      variant="outline"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      {typeIcons[task.type] || typeIcons.task}
                      {task.type.replace('_', ' ')}
                    </span>
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {search || filter !== 'all' 
                  ? 'No tasks match your filters'
                  : 'No tasks yet. Create your first task to get started!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}