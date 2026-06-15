import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppAuthError, AuthContextValue, UserProfile } from "./auth.types";
import { supabase } from "../../../shared/api/supabase/supabaseClient";
import { getUserProfile } from "./auth.api";
import { AuthContext } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  createAuthError,
  getProfileError,
  isAppAuthError,
} from "./auth.errors";
import { shouldLoadProfile } from "./auth.session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [authError, setAuthError] = useState<AppAuthError | null>(null);

  const profileRef = useRef<UserProfile | null>(null);
  const resolvingUserIdRef = useRef<string | null>(null);
  const profileRequestIdRef = useRef(0);

  const setProfileState = useCallback((newProfile: UserProfile | null) => {
    setProfile(newProfile);
    profileRef.current = newProfile;
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const clearAuthState = useCallback(() => {
    profileRequestIdRef.current += 1;
    resolvingUserIdRef.current = null;

    setSession(null);
    setProfileState(null);
    setIsProfileLoading(false);
  }, [setProfileState]);

  const resolveSession = useCallback(
    async (
      nextSession: Session | null,
      options: { forceProfileReload?: boolean } = {},
    ) => {
      if (!nextSession) {
        clearAuthState();
        return;
      }

      // Get Id
      const nextProfileId = nextSession.user.id;

      setSession(nextSession);

      // Check if the new profile should be loaded
      if (
        !shouldLoadProfile({
          userId: nextProfileId,
          profileUserId: profileRef.current?.id,
          resolvingUserId: resolvingUserIdRef.current ?? undefined,
          force: options.forceProfileReload,
        })
      ) {
        setAuthError(null);
        return;
      }

      // Setup Refs, clear error, start loading
      const requestId = ++profileRequestIdRef.current;
      resolvingUserIdRef.current = nextProfileId;
      setAuthError(null);
      setIsProfileLoading(true);

      // Reset before refetch only on new user
      if (profileRef.current?.id !== nextProfileId) {
        setProfileState(null);
      }

      try {
        // Get Profile
        const nextProfile = await getUserProfile(nextProfileId);

        // Req Id check to avoid race condition
        if (requestId !== profileRequestIdRef.current) return;

        // Sign out and error message on invalid profile
        if (!nextProfile) {
          const error = createAuthError(
            "missing_profile",
            "Your user profile was not found. Please contact an administrator.",
          );

          setAuthError(error);

          try {
            await supabase.auth.signOut();
          } finally {
            clearAuthState();
          }

          throw error;
        }

        // Sign out and error message on inactive profile
        if (!nextProfile.active) {
          const error = createAuthError(
            "inactive_profile",
            "Your account is inactive. Please contact an administator.",
          );

          setAuthError(error);

          try {
            await supabase.auth.signOut();
          } finally {
            clearAuthState();
          }

          throw error;
        }

        setProfileState(nextProfile);
        setAuthError(null);
      } catch (error) {
        if (isAppAuthError(error)) {
          throw error;
        }

        if (requestId !== profileRequestIdRef.current) return;

        const profileError = getProfileError(error);
        setAuthError(profileError);

        throw profileError;
      } finally {
        if (requestId === profileRequestIdRef.current) {
          setIsProfileLoading(false);
        }
        if (resolvingUserIdRef.current === nextProfileId) {
          resolvingUserIdRef.current = null;
        }
      }
    },
    [clearAuthState, setProfileState],
  );

  const retryProfile = useCallback(async () => {
    if (!session) return;

    await resolveSession(session, { forceProfileReload: true });
  }, [session, resolveSession]);

  // Session load and update
  useEffect(() => {
    let isMounted = true;

    const loadInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (isMounted) {
          await resolveSession(data.session);
        }
      } catch (error) {
        if (!isMounted) return;

        const authError = getProfileError(error);
        setAuthError(authError);

        if (authError.code !== "profile_request_failed") {
          clearAuthState();
        }

        console.error("Initial auth failed:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleAuthStateChange = async (
      event: AuthChangeEvent,
      nextSession: Session | null,
    ) => {
      if (!isMounted) return;

      try {
        switch (event) {
          case "INITIAL_SESSION": {
            return;
          }

          case "TOKEN_REFRESHED": {
            if (nextSession) {
              setSession(nextSession);
            } else {
              clearAuthState();
            }

            return;
          }

          case "SIGNED_OUT": {
            clearAuthState();
            return;
          }

          case "SIGNED_IN": {
            await resolveSession(nextSession);
            return;
          }

          case "USER_UPDATED": {
            await resolveSession(nextSession, {
              forceProfileReload: true,
            });
            return;
          }

          default: {
            return;
          }
        }
      } catch (error) {
        if (!isMounted) return;

        const authError = getProfileError(error);
        setAuthError(authError);
        setIsProfileLoading(false);

        console.error("Auth state change failed", error);
      }
    };

    loadInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, nextSession) =>
        window.setTimeout(() => {
          void handleAuthStateChange(event, nextSession);
        }, 0),
    );

    return () => {
      isMounted = false;
      profileRequestIdRef.current += 1;
      resolvingUserIdRef.current = null;
      authListener.subscription.unsubscribe();
    };
  }, [clearAuthState, resolveSession]);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;

    return {
      session,
      user,
      profile,

      isLoading,
      isProfileLoading,
      isAuthenticated: Boolean(session && profile?.active),

      authError,
      clearAuthError,
      retryProfile,

      signIn: async (email: string, password: string) => {
        clearAuthError();

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          const authError = createAuthError(
            "invalid_credentials",
            "Invalid email or password.",
            error,
          );

          setAuthError(authError);
          throw authError;
        }

        if (data.session) {
          await resolveSession(data.session);
        }
      },

      signOut: async () => {
        clearAuthError();

        const { error } = await supabase.auth.signOut();

        if (error) {
          const authError = createAuthError(
            "sign_out_failed",
            "We could not sign you out on the server. Local session was cleared.",
            error,
          );

          setAuthError(authError);
          clearAuthState();
          queryClient.clear();

          throw authError;
        }

        clearAuthState();
        queryClient.clear();
      },
    };
  }, [
    session,
    profile,
    isLoading,
    isProfileLoading,
    authError,
    clearAuthError,
    retryProfile,
    resolveSession,
    clearAuthState,
    queryClient,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
