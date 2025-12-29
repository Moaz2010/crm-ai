'use client';

import { useState } from 'react';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';
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

// Mock data for tasks
const mockTasks = [
  {
    id: '1',
    title: 'Follow up with John Smith',
    description: 'Send proposal and schedule demo call',
    type: 'follow_up',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-20',
    assignedTo: 'Me',
    relatedTo: { type: 'lead', name: 'John Smith' },
  },
  {
    id: '2',
    title: 'Prepare Q4 report',
    description: 'Compile sales data for quarterly review',
    type: 'task',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2024-01-25',
    assignedTo: 'Me',
    relatedTo: null,
  },
  {
    id: '3',
    title: 'Call Sarah Johnson',
    description: 'Discuss contract renewal terms',
    type: 'call',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-18',
    assignedTo: 'Me',
    relatedTo: { type: 'contact', name: 'Sarah Johnson' },
  },
  {
    id: '4',
    title: 'Send meeting notes',
    description: 'Email summary of product demo to TechCorp team',
    type: 'email',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-15',
    assignedTo: 'Me',
    relatedTo: { type: 'company', name: 'TechCorp' },
  },
  {
    id: '5',
    title: 'Review contract terms',
    description: 'Legal review for GlobalTech deal',
    type: 'task',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2024-01-17',
    assignedTo: 'Me',
    relatedTo: { type: 'deal', name: 'GlobalTech Partnership' },
  },
];

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
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && task.status === 'pending') ||
      (filter === 'in_progress' && task.status === 'in_progress') ||
      (filter === 'completed' && task.status === 'completed');
    
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your tasks and stay on top of your work
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your list
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Task title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
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
                  <Select>
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
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
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
            {filteredTasks.map((task) => (
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
                      className={priorityColors[task.priority as keyof typeof priorityColors]}
                      variant="outline"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      {typeIcons[task.type]}
                      {task.type.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    {task.relatedTo && (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {task.relatedTo.type}: {task.relatedTo.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
