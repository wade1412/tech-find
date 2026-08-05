import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";
import type { User } from "../../../entities/user/user.types";
import { supabase } from "../../../shared/api/supabase/supabaseClient";
import type { CreateUserInput } from "../model/editUser.types";

interface CreateUserResponse {
  user: User;
}

async function getFunctionErrorMessage(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = (await error.context.json()) as { message?: unknown };
      if (typeof body.message === "string") return body.message;
    } catch {
      // Fall through to the SDK error when the response is not JSON.
    }
  }

  if (error instanceof FunctionsFetchError) {
    return "Could not reach the user creation service. Check your connection and Edge Function deployment.";
  }

  if (error instanceof FunctionsRelayError) {
    return "The user creation service is temporarily unavailable. Try again.";
  }

  return error instanceof Error ? error.message : "Failed to create user";
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data, error } = await supabase.functions.invoke<CreateUserResponse>(
    "create-user",
    { body: input },
  );

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  if (!data?.user) {
    throw new Error("The server returned an invalid user response");
  }

  return data.user;
}
