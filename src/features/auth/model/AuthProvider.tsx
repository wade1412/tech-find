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

    const loadProfileForSession = async (nextSession: Session | null) => {
      try {
        setSession(nextSession);

        if (!nextSession?.user) {
          setProfile(null);
          return;
        }

        const userProfile = await getCurrentUserProfile(nextSession.user.id);

        if (!isMounted) return;

        setProfile(userProfile);
      } catch (error) {
        console.error("Failed to load user profile:", error);

        if (!isMounted) return;

        setProfile(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const loadSession = async () => {
      setIsLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error);

        if (isMounted) {
          setSession(null);
          setProfile(null);
          setIsLoading(false);
        }

        return;
      }

      await loadProfileForSession(data.session);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setIsLoading(true);

        window.setTimeout(() => {
          loadProfileForSession(nextSession);
        }, 0);
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
