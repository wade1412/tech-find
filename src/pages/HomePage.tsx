import TechnicianList from "../entities/technician/ui/TechnicianList";
import UnitList from "../entities/unit/ui/UnitList";
import BrandSelect from "../features/technician-filter/ui/BrandSelect";

export function HomePage() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
      <TechnicianList />

      <UnitList />

      <BrandSelect />
    </div>
  );
}

export default HomePage;
