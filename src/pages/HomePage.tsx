import TechnicianList from "../entities/technician/ui/TechnicianList";
import UnitList from "../entities/unit/ui/UnitList";

export function HomePage() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
      <TechnicianList />

      <UnitList />
    </div>
  );
}

export default HomePage;
