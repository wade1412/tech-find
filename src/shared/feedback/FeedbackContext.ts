import { createContext } from "react";
import type { FeedbackContextValue } from "./feedback.types";

export const FeedbackContext = createContext<FeedbackContextValue | null>(null);
