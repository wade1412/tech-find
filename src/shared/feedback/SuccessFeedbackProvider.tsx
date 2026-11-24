import { useState, type ReactNode } from "react";
import type { FeedbackContextValue } from "./feedback.types";
import { FeedbackContext } from "./FeedbackContext";
import SaveSuccessSnackbar from "../ui/SaveSuccessSnackbar";

interface SuccessFeedbackProviderProps {
  children: ReactNode;
}

export function SuccessFeedbackProvider({
  children,
}: SuccessFeedbackProviderProps) {
  const [message, setMessage] = useState("Changes saved succesfully");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [feedbackKey, setFeedbackKey] = useState(0);

  const openSuccessFeedbackWithMessage = (newMessage: string) => {
    setMessage(newMessage);
    setFeedbackKey((prev) => prev + 1);
    setIsSnackbarOpen(true);
  };

  const handleClose = () => setIsSnackbarOpen(false);

  const contextValue: FeedbackContextValue = {
    openSuccessFeedbackWithMessage,
  };

  return (
    <FeedbackContext.Provider value={contextValue}>
      <SaveSuccessSnackbar
        key={feedbackKey}
        message={message}
        isOpen={isSnackbarOpen}
        onClose={handleClose}
      />
      {children}
    </FeedbackContext.Provider>
  );
}
