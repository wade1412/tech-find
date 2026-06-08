import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthContextValue, UserProfile } from "./auth.types";
import { supabase } from "../../../shared/api/supabase/supabaseClient";
import { getCurrentUserProfile } from "./auth.api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session load and update
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setIsLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      const currentSession = data.session;

      if (!isMounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        const userProfile = await getCurrentUserProfile(currentSession.user.id);
        if (isMounted) {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);

        if (nextSession?.user) {
          const userProfile = await getCurrentUserProfile(nextSession.user.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;

    return {
      session,
      user,
      profile,
      isLoading,
      isAuthenticated: Boolean(session && profile?.active),
      signIn: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }
      },
    };
  }, [session, profile, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
