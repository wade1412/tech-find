import SectionHeader from "../../ui/SectionHeader";
import type {
  SkillTemplateAvailability,
  SkillTemplateDefinition,
} from "../model/skillTemplates.types";

export type SkillTemplateFeedback = {
  tone: "success" | "info" | "error";
  message: string;
};

interface SkillTemplatesProps {
  templates: readonly SkillTemplateDefinition[];
  onApply: (template: SkillTemplateDefinition) => void;
  disabled: boolean;
  availabilityById: ReadonlyMap<
    SkillTemplateDefinition["id"],
    SkillTemplateAvailability
  >;
  feedback: SkillTemplateFeedback | null;
}

function SkillTemplates({
  templates,
  onApply,
  disabled,
  availabilityById,
  feedback,
}: SkillTemplatesProps) {
  const configurationErrors = Array.from(
    new Set(
      templates.flatMap((template) => {
        const availability = availabilityById.get(template.id);

        return availability?.status === "unavailable"
          ? [availability.error]
          : [];
      }),
    ),
  );

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        label="Skill Templates"
        subtext="Add a brand group skill for every active unit"
      />

      <div className="flex flex-wrap gap-2">
        {templates.map((template) => {
          const availability = availabilityById.get(template.id);
          const isUnavailable = availability?.status !== "available";
          const isComplete =
            availability?.status === "available" &&
            availability.missingCount === 0;
          const isDisabled = disabled || isUnavailable || isComplete;
          const title =
            availability?.status === "unavailable"
              ? availability.error
              : isComplete
                ? "All skills from this template are already added"
                : undefined;

          return (
            <button
              key={template.id}
              type="button"
              disabled={isDisabled}
              title={title}
              className="focus-visible:ring-main-500 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-[background-color,border-color,color,opacity,transform] enabled:hover:border-zinc-300 enabled:hover:bg-zinc-100 enabled:hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:enabled:hover:border-zinc-700 dark:enabled:hover:bg-zinc-800/70 dark:enabled:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950"
              onClick={() => onApply(template)}
            >
              <span>{template.label}</span>
              {isComplete && (
                <span className="text-main-600 dark:text-main-400">Added</span>
              )}
            </button>
          );
        })}
      </div>

      {configurationErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
        >
          {configurationErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      {feedback && (
        <p
          role={feedback.tone === "error" ? "alert" : "status"}
          aria-live="polite"
          className={
            feedback.tone === "error"
              ? "text-xs font-medium text-red-600 dark:text-red-400"
              : feedback.tone === "success"
                ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                : "text-xs font-medium text-zinc-500 dark:text-zinc-400"
          }
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}

export default SkillTemplates;
