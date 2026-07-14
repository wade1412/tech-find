import type { SkillTemplateDefinition } from "../model/skillTemplates.types";

interface SkillTemplateProps {
  templates: readonly SkillTemplateDefinition[];
  onApply: (template: SkillTemplateDefinition) => void;
}

function SkillTemplates({ templates, onApply }: SkillTemplateProps) {
  return <div>SkillTemplates</div>;
}

export default SkillTemplates;
