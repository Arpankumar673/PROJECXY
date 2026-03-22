import { supabase } from './supabase';

/**
 * 🛠️ CORE SERVICE RESOLVER
 * High-performance wrapper for Supabase operations to ensure consistent returns.
 */
const resolve = async (promise) => {
    try {
        const { data, error } = await promise;
        if (error) throw error;
        return { data, error: null };
    } catch (err) {
        console.error("SERVICE ERROR:", err.message);
        return { data: null, error: err };
    }
};

/**
 * 📊 PROJECT SERVICE
 */
export const projectService = {
  async create(projectData) {
    const { data: { user } } = await supabase.auth.getUser();
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
    return await resolve(supabase.from('projects').insert([finalData]).select().single());
  },

  async getAll() {
    return await resolve(
       supabase
        .from('projects')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
    );
  },

  async getProjects() {
     return await this.getAll();
  },

  async getById(id) {
    return await resolve(
       supabase
        .from('projects')
        .select('*, profiles(*)')
        .eq('id', id)
        .single()
    );
  },

  async update(id, updateData) {
    return await resolve(
       supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
    );
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
    return await resolve(
       supabase.from('project_members').insert([
           { project_id: projectId, user_id: userId, role_in_team: role }
       ]).select().single()
    );
  },

  async getMembers(projectId) {
     return await resolve(
        supabase
           .from('project_members')
           .select('*, profiles(*)')
           .eq('project_id', projectId)
     );
  },

  async getJoinRequests(projectId) {
    return await resolve(
       supabase
        .from('join_requests')
        .select('*, profiles(*)')
        .eq('project_id', projectId)
        .eq('status', 'pending')
    );
  },

  async sendJoinRequest(projectId, userId, message) {
    return await resolve(
       supabase
        .from('join_requests')
        .insert([{ project_id: projectId, user_id: userId, message }])
        .select()
        .single()
    );
  },

  async handleRequest(requestId, status) {
     return await resolve(
        supabase.from('join_requests').update({ status }).eq('id', requestId).select().single()
     );
  }
};

/**
 * 📅 MILESTONE SERVICE
 */
export const milestoneService = {
  async getByProject(projectId) {
    return await resolve(
       supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
    );
  },

  async complete(id, fileUrl) {
    return await resolve(
       supabase.from('milestones').update({ status: 'completed', file_url: fileUrl }).eq('id', id).select().single()
    );
  }
};

/**
 * 📂 STORAGE SERVICE
 */
export const storageService = {
  async uploadFile(bucket, path, file) {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    const { data: { publicUrl } } = await supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }
};
