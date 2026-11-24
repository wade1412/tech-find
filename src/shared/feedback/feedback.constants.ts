import type { FeedbackMessageTemplate, FeedbackText } from "./feedback.types";

const BASE_TEXT_SAVE = `changes saved`;
const BASE_TEXT_CREATED = `was successfully created`;

const getFeedbackText = (entityName: string): FeedbackText => ({
  saved: `${entityName} ${BASE_TEXT_SAVE}`,
  created: `${entityName} ${BASE_TEXT_CREATED}`,
});

export const FEEDBACK_TEXT: FeedbackMessageTemplate = {
  technician: getFeedbackText("Technician"),
  unit: getFeedbackText("Unit"),
  brand: getFeedbackText("Brand"),
  brandGroup: getFeedbackText("Brand group"),
  zone: getFeedbackText("Zone"),
  specificIssue: getFeedbackText("Specific issue"),
  serviceZone: getFeedbackText("Service zone"),
  skill: getFeedbackText("Skill"),
  ignoreList: getFeedbackText("Ignore list"),
  user: getFeedbackText("User"),
};
