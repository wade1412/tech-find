import type { Session } from "@supabase/supabase-js";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextValue, UserProfile } from "./auth.types";
import { supabase } from "../../../shared/api/supabase/supabaseClient";
import { getUserProfile } from "./auth.api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const hasInitializedAuthRef = useRef(false);
  const sessionUserIdRef = useRef<string | null>(null);
  const profileRef = useRef(profile);

  const setSessionState = useCallback((session: Session | null) => {
    setSession(session);
    sessionUserIdRef.current = session?.user.id ?? null;
  }, []);

  const setProfileState = useCallback((profile: UserProfile | null) => {
    setProfile(profile);
    profileRef.current = profile;
  }, []);

  const clearAuthState = useCallback(() => {
    setSessionState(null);
    setProfileState(null);
    setIsProfileLoading(false);
  }, [setProfileState, setSessionState]);

  const finishInitialAuth = useCallback(() => {
    setIsLoading(false);
    hasInitializedAuthRef.current = true;
  }, []);

  // Session load and update
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (id: string): Promise<UserProfile | null> => {
      try {
        const userProfile = await getUserProfile(id);

        return userProfile;
      } catch (error) {
        console.error("Failed to load user profile:", error);
        return null;
      }
    };

    const loadInitialSession = async () => {
      if (!hasInitializedAuthRef.current) {
        setIsLoading(true);
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error);

        if (isMounted) {
          clearAuthState();
          finishInitialAuth();
        }

        return;
      }

      if (!data || !data.session?.user) {
        if (isMounted) {
          clearAuthState();
          finishInitialAuth();
        }
        return;
      }

      setIsProfileLoading(true);
      const currentProfile = await fetchProfile(data.session.user.id);

      if (!isMounted) return;

      setSessionState(data.session);
      setProfileState(currentProfile);
      setIsProfileLoading(false);
      finishInitialAuth();
    };

    const handleAuthStateChange = async (nextSession: Session | null) => {
      if (!isMounted) return;

      if (!nextSession) {
        clearAuthState();
        setIsLoading(false);
        return;
      }

      setSessionState(nextSession);

      const nextProfileId = nextSession.user.id;

      if (!profileRef.current || profileRef.current.id !== nextProfileId) {
        setProfileState(null);
        setIsProfileLoading(true);
        const nextProfile = await fetchProfile(nextProfileId);

        if (!isMounted) return;
        if (sessionUserIdRef.current !== nextProfileId) return;

        setProfileState(nextProfile);
        setIsProfileLoading(false);
      }
    };

    loadInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) =>
        window.setTimeout(() => {
          handleAuthStateChange(nextSession);
        }, 0),
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [clearAuthState, setSessionState, setProfileState, finishInitialAuth]);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;

    return {
      session,
      user,
      profile,
      isLoading,
      isProfileLoading,
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
  }, [session, profile, isLoading, isProfileLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
