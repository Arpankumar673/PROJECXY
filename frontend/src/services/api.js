import { supabase } from './supabase';

/**
 * 📊 PROJECT SERVICE
 */
export const projectService = {
  async create(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Auto-fetch department for MVP if not specified
    let departmentId = projectData.department_id;
    if (!departmentId) {
       const { data: depts } = await supabase.from('departments').select('id').limit(1);
       departmentId = depts?.[0]?.id;
    }
    
    const finalData = { 
        ...projectData, 
        created_by: user?.id, 
        department_id: departmentId 
    };

    return await supabase.from('projects').insert([finalData]).select().single();
  },

  async getAll() {
    const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
    return data || []; // Return raw data to match component expectation
  },

  async getProjects() {
     // Alias for getAll used in dashboard
     return await this.getAll();
  },

  async getById(id) {
    const { data } = await supabase
        .from('projects')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();
    return data;
  },

  async update(id, updateData) {
    return await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
  },

  async updateStatus(id, status) {
     return await this.update(id, { status });
  }
};

/**
 * 👥 TEAM SERVICE
 */
export const teamService = {
  async addMember(projectId, userId, role = 'Member') {
    return await supabase.from('project_members').insert([
        { project_id: projectId, user_id: userId, role_in_team: role }
    ]).select().single();
  },

  async getMembers(projectId) {
     const { data } = await supabase
        .from('project_members')
        .select('*, profiles(*)')
        .eq('project_id', projectId);
     return data || [];
  },

  async getJoinRequests(projectId) {
    const { data } = await supabase
        .from('join_requests')
        .select('*, profiles(*)')
        .eq('project_id', projectId)
        .eq('status', 'pending');
    return data || [];
  },

  async handleRequest(requestId, status) {
     return await supabase.from('join_requests').update({ status }).eq('id', requestId).select().single();
  }
};

/**
 * 📅 MILESTONE SERVICE
 */
export const milestoneService = {
  async getByProject(projectId) {
    const { data } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
    return data || [];
  },

  async complete(id, fileUrl) {
    return await supabase.from('milestones').update({ status: 'completed', file_url: fileUrl }).eq('id', id).select().single();
  }
};

/**
 * 📂 STORAGE SERVICE
 */
export const storageService = {
  async uploadFile(bucket, path, file) {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    
    // Auto-resolve public URL
    const { data: { publicUrl } } = await supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }
};
