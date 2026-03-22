import React, { useState } from 'react';
import { 
  Plus, CheckCircle2, Clock, MoreHorizontal, 
  MessageSquare, Paperclip, Calendar, User, 
  ChevronRight, GripVertical
} from 'lucide-react';
import { Card, cn } from '../ui';

const STAGES = ['Todo', 'Doing', 'Done'];

export const KanbanBoard = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Architecture Design', stage: 'Done', priority: 'High', members: ['A'], comments: 5 },
        { id: 2, title: 'Supabase Integration', stage: 'Doing', priority: 'Medium', members: ['B', 'C'], comments: 2 },
        { id: 3, title: 'UI Dashboard Fix', stage: 'Todo', priority: 'High', members: ['A', 'B'], comments: 0 },
        { id: 4, title: 'Auth RLS Policy', stage: 'Todo', priority: 'Low', members: ['C'], comments: 8 },
    ]);

    const moveTask = (taskId, newStage) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, stage: newStage } : t));
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {STAGES.map((stage) => (
                <div key={stage} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 mb-2">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "w-2 h-2 rounded-full",
                                stage === 'Todo' ? 'bg-gray-300' : stage === 'Doing' ? 'bg-amber-400' : 'bg-emerald-400'
                            )} />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-projecxy-secondary">{stage}</h3>
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1">
                                {tasks.filter(t => t.stage === stage).length}
                            </span>
                        </div>
                        <button className="p-1 hover:bg-gray-50 rounded-md text-gray-400"><Plus className="w-4 h-4" /></button>
                    </div>

                    <div className="space-y-4">
                        {tasks.filter(t => t.stage === stage).map((task) => (
                            <Card key={task.id} className="p-4 bg-white border border-gray-100 shadow-soft hover:border-projecxy-blue transition-all group cursor-grab active:cursor-grabbing">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-tighter",
                                        task.priority === 'High' ? 'bg-red-50 text-red-500' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-500'
                                    )}>
                                        {task.priority}
                                    </span>
                                    <button className="text-gray-300 group-hover:text-projecxy-blue transition-colors px-1"><GripVertical className="w-4 h-4" /></button>
                                </div>
                                <h4 className="text-sm font-bold text-projecxy-text mb-4 leading-tight">{task.title}</h4>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <div className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">{task.comments}</span></div>
                                        <div className="flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" /><span className="text-[10px] font-bold">3</span></div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {task.members.map((m, i) => (
                                            <div key={i} className="w-6 h-6 rounded-lg bg-projecxy-blue text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">{m}</div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    {stage === 'Todo' && (
                        <button className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 hover:border-projecxy-blue hover:text-projecxy-blue hover:bg-projecxy-blue/5 transition-all text-sm font-bold mt-2">
                            <Plus className="w-4 h-4" /> New Task
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
