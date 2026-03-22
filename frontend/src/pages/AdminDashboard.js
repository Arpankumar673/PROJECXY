import React, { useEffect, useState } from 'react';
import { Check, X, ShieldAlert, BarChart3, Database, Users, Download, Eye, FileSearch, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { projectService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const AdminDashboard = () => {
  const { loading: authLoading } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await projectService.getAll();
    if (data) {
       setAllProjects(data);
       setPendingApprovals(data.filter(p => p.status === 'pending'));
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (projectId, status) => {
    try {
      await projectService.updateStatus(projectId, status);
      fetchData();
    } catch (error) {
       alert(error.message);
    }
  };

  if (authLoading || loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-12 h-12 text-projecxy-blue animate-spin" /></div>;

  return (
    <div className="space-y-10 animate-fade-in-up">
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
              { label: 'Pending Approvals', value: pendingApprovals.length, icon: ShieldAlert, color: 'text-amber-500 bg-amber-50/50' },
              { label: 'Total Projects', value: allProjects.length, icon: BarChart3, color: 'text-projecxy-blue bg-blue-50/50' },
              { label: 'Engagement Index', value: 'High', icon: Users, color: 'text-emerald-500 bg-emerald-50/50' },
              { label: 'Storage Sync', value: 'Live', icon: Database, color: 'text-purple-500 bg-purple-50/50' }
           ].map((stat, i) => (
              <Card key={i} className={`p-8 border-none shadow-md hover:shadow-xl transition-all group relative overflow-hidden flex flex-col items-center text-center ${stat.color}`}>
                 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm bg-white border border-opacity-10 border-black">
                    <stat.icon className="w-8 h-8" />
                 </div>
                 <h4 className="text-3xl font-black text-projecxy-text mb-1">{stat.value}</h4>
                 <p className="text-xs text-projecxy-secondary font-bold uppercase tracking-widest leading-none">{stat.label}</p>
              </Card>
           ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
           <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-10 rounded-3xl shadow-card border border-gray-100 overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                 <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                       <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                          <FileSearch className="w-7 h-7 text-amber-500" />
                          Approval Queue
                       </h2>
                       <p className="text-projecxy-secondary text-sm font-medium">Synced from department archives.</p>
                    </div>
                 </div>
                 
                 <div className="overflow-x-auto text-nowrap">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 border-gray-50 pb-6 mb-6">
                         <th className="pb-6">Project Title</th>
                         <th className="pb-6">Submitted By</th>
                         <th className="pb-6">Status</th>
                         <th className="pb-6">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {pendingApprovals.map((p) => (
                         <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                           <td className="py-10">
                             <div className="flex flex-col">
                                <span className="font-bold text-lg text-projecxy-text group-hover:text-projecxy-blue transition-colors mb-1">{p.title}</span>
                                <span className="text-[10px] text-projecxy-secondary font-medium uppercase tracking-tight">{p.id.slice(0,8)}</span>
                             </div>
                           </td>
                           <td className="py-10 text-sm font-semibold text-gray-500 truncate max-w-[150px]">{p.profiles?.full_name}</td>
                           <td className="py-10 text-[10px] font-bold uppercase text-amber-500">{p.status}</td>
                           <td className="py-10">
                             <div className="flex items-center gap-3">
                               <button onClick={() => handleStatusUpdate(p.id, 'recruiting')} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100">
                                 <Check className="w-5 h-5" />
                               </button>
                               <button onClick={() => handleStatusUpdate(p.id, 'rejected')} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100">
                                 <X className="w-5 h-5" />
                               </button>
                               <button className="p-3 bg-blue-50 text-projecxy-blue rounded-xl hover:bg-projecxy-blue hover:text-white transition-all shadow-sm border border-blue-100">
                                  <Eye className="w-5 h-5" />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                       {pendingApprovals.length === 0 && (
                          <tr><td colSpan="4" className="py-20 text-center font-bold text-gray-300">No pending projects for review.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
              </section>
           </div>
           
           <div className="space-y-8">
              <Card className="p-10 bg-projecxy-text text-white border-none shadow-2xl relative group overflow-hidden rounded-[40px]">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:translate-x-4 transition-transform"><Database className="w-32 h-32" /></div>
                 <h3 className="font-black text-xs uppercase tracking-[0.2em] text-projecxy-blue mb-4">Innovation Index</h3>
                 <p className="text-3xl font-black mb-8 leading-tight">Your department has <span className="text-projecxy-blue underline decoration-4 underline-offset-8 decoration-projecxy-blue/30">{allProjects.length} live</span> projects recorded.</p>
                 <Button className="w-full bg-white text-projecxy-text hover:bg-gray-100 border-none h-14 font-black">Generate Report</Button>
              </Card>

              <section className="bg-white p-8 rounded-3xl shadow-card border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="font-black text-xl flex items-center gap-2 tracking-tighter uppercase"><Download className="w-6 h-6 text-projecxy-blue" /> Quick Tools</h3>
                  </div>
                  <div className="space-y-4">
                     {['Bulk Approve', 'Export Master CSV', 'Generate Statistics', 'Archive Session'].map((tool, i) => (
                        <button key={i} className="w-full p-4 text-left font-bold text-xs uppercase tracking-widest text-projecxy-secondary hover:bg-blue-50 hover:text-projecxy-blue rounded-xl border border-transparent hover:border-blue-100 transition-all flex justify-between items-center group">
                           {tool}
                           <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                        </button>
                     ))}
                  </div>
              </section>
           </div>
        </div>
      </div>
  );
};
