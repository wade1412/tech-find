import type { Technician } from "../technician.types";

interface TechnicianCardProps {
  technician: Technician;
  isOpen: boolean;
  onToggle: () => void;
}

function TechnicianCard({ technician, isOpen, onToggle }: TechnicianCardProps) {
  const specificSkills = [
    technician.gas && "Gas",
    technician.can_service_built_in && "Built-In",
    technician.can_service_stacked_dryer && "Stacked Dryer",
    technician.can_service_stacked_washer && "Stacked Washer",
    technician.commercial && "Commercial",
  ].filter(Boolean) as string[];

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      className={`flex items-center rounded-xl border py-2 text-center transition-all duration-250 cursor-pointer  ${isOpen ? "justify-around bg-zinc-200 dark:bg-zinc-700" : "justify-center border-zinc-500 hover:-translate-y-1 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"}`}
    >
      {/* Main Info, visible always */}
      <div>
        <p
          className={`text-lg font-semibold transition-colors ${isOpen ? "text-main-500/80" : "dark:text-main-500"}`}
        >
          {technician.name}
        </p>
        <p>
          <i>Home Zip:</i> {technician.home_zip_code}
        </p>
        <p>
          <i>Jobs per day:</i> {technician.jobs_per_day}
        </p>
      </div>

      {/* Additional info, open when clicked */}
      <div className={`${isOpen ? "flex flex-col gap-1 max-w-1/2" : "hidden"}`}>
        {specificSkills.length > 0 ? (
          <div>
            <p className="italic">Specific skills:</p>
            <ul>
              {specificSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="italic">No Specific Skills</p>
        )}

        {technician.notes && (
          <p className="text-wrap">
            <i>Notes:</i> {technician.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default TechnicianCard;
