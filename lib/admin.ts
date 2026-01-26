import { supabase } from './supabase';

/**
 * Check if user is admin (either hardcoded admin@admin.com or has admin role)
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !userId) return false;

    const targetId = userId || user?.id;
    if (!targetId) return false;

    // Check if user is the hardcoded admin
    if (user?.email === 'admin@admin.com') return true;

    // Check if user is in admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', targetId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
}

/**
 * Get user role (super_admin, admin, moderator, or null)
 */
export async function getUserRole(userId?: string): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !userId) return null;

    const targetId = userId || user?.id;
    if (!targetId) return null;

    // Check if user is the hardcoded admin
    if (user?.email === 'admin@admin.com') return 'super_admin';

    // Get role from admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', targetId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user role:', error);
      return null;
    }

    return data?.role || null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  permission: 'manage_banners' | 'manage_users' | 'manage_ebooks' | 'manage_admins',
  userId?: string
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !userId) return false;

    const targetId = userId || user?.id;
    if (!targetId) return false;

    // Hardcoded admin has all permissions
    if (user?.email === 'admin@admin.com') return true;

    // Get permissions from admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('permissions')
      .eq('user_id', targetId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking permission:', error);
      return false;
    }

    return data?.permissions?.[permission] === true;
  } catch (error) {
    console.error('Error in hasPermission:', error);
    return false;
  }
}

/**
 * Add user as admin
 */
export async function addAdmin(
  userId: string,
  role: 'admin' | 'super_admin' | 'moderator' = 'admin',
  permissions = {
    manage_banners: true,
    manage_users: false,
    manage_ebooks: true,
    manage_admins: false
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        role,
        permissions
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Remove admin access
 */
export async function removeAdmin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update admin role or permissions
 */
export async function updateAdmin(
  userId: string,
  updates: {
    role?: 'admin' | 'super_admin' | 'moderator';
    permissions?: Record<string, boolean>;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
