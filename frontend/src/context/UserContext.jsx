import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Fallback for missing profile
        console.warn("User profile not found, initializing empty profile.");
        setProfile({ id: userId, full_name: "Innovator", avatar_url: "" });
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch sequence failure:", err);
    }
  };

  useEffect(() => {
    // 1. Initial Session Sync
    const init = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    // 2. Real-time Auth Transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Global Auth Transition:", event);
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    init();
    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, setProfile, loading, refreshProfile: () => user && fetchProfile(user.id) }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
