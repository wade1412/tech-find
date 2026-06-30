import { headingStyleDefault } from "../../../shared/styles/styles";

interface SectionHeaderProps {
  label: string;
  subtext?: string;
}

function SectionHeader({ label, subtext }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h3 className={headingStyleDefault}>{label}</h3>

      {subtext && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtext}</p>
      )}
    </div>
  );
}

export default SectionHeader;
