export type FeedbackContextValue = {
  openSuccessFeedbackWithMessage: (newMessage: string) => void;
};

export type FeedbackText = {
  saved: string;
  created: string;
};

export type FeedbackEntity =
  | "technician"
  | "unit"
  | "brand"
  | "brandGroup"
  | "zone"
  | "specificIssue"
  | "serviceZone"
  | "skill"
  | "ignoreList"
  | "user";

export type FeedbackMessageTemplate = Record<FeedbackEntity, FeedbackText>;
