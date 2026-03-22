import { supabase } from './supabase';

/**
 * 📊 PROJECT SERVICE
 */
export const projectService = {
  async createProject(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Auto-fetch department for MVP
    const { data: depts } = await supabase.from('departments').select('id').limit(1);
    
    const finalData = { 
        ...projectData, 
        created_by: user?.id, 
        department_id: depts?.[0]?.id 
    };

    const result = await supabase.from('projects').insert([finalData]).select().single();
    
    // Auto-add creator as Lead if successful
    if (!result.error && result.data) {
        await supabase.from('project_members').insert([
            { project_id: result.data.id, user_id: user.id, role_in_team: 'Lead' }
        ]);
    }

    return result;
  },

  async getProjects() {
    return await supabase
        .from('projects')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
  },

  async getProjectById(id) {
    return await supabase
        .from('projects')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();
  },

  async updateProject(id, updateData) {
    return await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
  }
};

/**
 * 👥 TEAM SERVICE
 */
export const teamService = {
  async sendJoinRequest(projectId, userId, message) {
    return await supabase
        .from('join_requests')
        .insert([{ project_id: projectId, user_id: userId, message }])
        .select()
        .single();
  },

  async getJoinRequests(projectId) {
    return await supabase
        .from('join_requests')
        .select('*, profiles(*)')
        .eq('project_id', projectId)
        .eq('status', 'pending');
  },

  async acceptRequest(requestId) {
     // Get request data first to move to members
     const { data: req } = await supabase.from('join_requests').select('*').eq('id', requestId).single();
     if (req) {
         await supabase.from('project_members').insert([
             { project_id: req.project_id, user_id: req.user_id, role_in_team: 'Member' }
         ]);
     }
     return await supabase.from('join_requests').update({ status: 'accepted' }).eq('id', requestId).select().single();
  },

  async rejectRequest(requestId) {
     return await supabase.from('join_requests').update({ status: 'rejected' }).eq('id', requestId).select().single();
  },

  async getProjectMembers(projectId) {
     return await supabase
        .from('project_members')
        .select('*, profiles(*)')
        .eq('project_id', projectId);
  }
};

/**
 * 📅 MILESTONE SERVICE
 */
export const milestoneService = {
  async createMilestone(milestoneData) {
    return await supabase.from('milestones').insert([milestoneData]).select().single();
  },

  async getMilestones(projectId) {
    return await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
  },

  async updateMilestone(id, updateData) {
    return await supabase.from('milestones').update(updateData).eq('id', id).select().single();
  }
};

/**
 * 📂 STORAGE SERVICE
 */
export const storageService = {
  async uploadFile(file, path) {
    return await supabase.storage.from('project-assets').upload(path, file);
  },

  async getPublicUrl(path) {
    return await supabase.storage.from('project-assets').getPublicUrl(path);
  }
};
