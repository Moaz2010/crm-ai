'use client';

import { useState } from 'react';
import { Kanban, Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PipelineBoard } from './components/pipeline-board';
import { CreateDealDialog } from './components/create-deal-dialog';
import { PipelineStats } from './components/pipeline-stats';

export default function PipelinePage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-purple-500" />
            Pipeline
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your deals through the sales pipeline
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </Button>
      </div>

      {/* Stats */}
      <PipelineStats />

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <PipelineBoard />
      </div>

      {/* Create Dialog */}
      <CreateDealDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
