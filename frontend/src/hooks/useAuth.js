import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        if (!userId) return;
        try {
            // Be resilient: first try selecting everything
            let { data: p, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .limit(1)
                .maybeSingle();

            // Fallback: If select '*' fails due to missing columns, try core identity fields only
            if (error) {
                console.warn("DEBUG: Initial profile fetch failed, trying mandatory fields:", error.message);
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('profiles')
                    .select('id, full_name, role')
                    .eq('id', userId)
                    .limit(1)
                    .maybeSingle();
                
                if (fallbackError) throw fallbackError;
                p = fallbackData;
            }

            if (p) {
                setProfile(p);
            }
        } catch (err) {
            console.error("CRITICAL: Profile engine failure:", err);
            // Even if fetch fails, we don't nullify existing user session if it was previously set
        }
    };

    useEffect(() => {
        const init = async () => {
             try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    // Fetch profile but don't let it block the app load
                    fetchProfile(session.user.id);
                }
             } catch (err) {
                 console.error("DEBUG: Auth Init System Failure:", err);
             } finally {
                 // Essential: Resolve loading NO MATTER WHAT
                 setLoading(false);
             }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("DEBUG: Global Auth Transition:", event);
            
            if (session?.user) {
                setUser(session.user);
                fetchProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false); // Ensure login page shows if no user
            }

            // If we have a user, resolve loading immediately so components can render
            // Profiles can continue loading in the background
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                setLoading(false);
            }
        });

        init();
        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signup = async (email, password, fullName, role) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, role } }
        });
        if (authError) throw authError;

        if (authData.user) {
           const { error: profileError } = await supabase.from('profiles').insert([
               { id: authData.user.id, full_name: fullName, role }
           ]);
           if (profileError) console.error("DEBUG: Profile setup failed:", profileError);
        }
        return authData;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
    };

    const loginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (error) throw error;
        return data;
    };

    const refreshProfile = () => user && fetchProfile(user.id);

    return (
        <AuthContext.Provider value={{ user, profile, loading, login, signup, logout, loginWithGoogle, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
