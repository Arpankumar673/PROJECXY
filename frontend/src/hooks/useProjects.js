import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useProjects = (userId) => {
    const [projects, setProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Fetch all projects for the campus feed
            const { data: allData, error: allErr } = await supabase
                .from('projects')
                .select(`
                    *,
                    owner:profiles(full_name, avatar_url),
                    members:project_members(count)
                `)
                .order('created_at', { ascending: false });

            if (allErr) throw allErr;
            setProjects(allData || []);

            // Fetch current user's projects (where they are owner or member)
            if (userId) {
                const { data: userData, error: userErr } = await supabase
                    .from('projects')
                    .select(`
                        *,
                        members!inner(user_id)
                    `)
                    .eq('members.user_id', userId);
                
                if (!userErr) {
                    setMyProjects(userData || []);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();

        // ⚡ REAL-TIME SUBSCRIPTION
        const channel = supabase
            .channel('projects-realtime')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'projects' 
            }, (payload) => {
                console.log('Real-time project change detected:', payload);
                fetchProjects(); // Refresh all data on change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return { projects, myProjects, loading, error, refetch: fetchProjects };
};
