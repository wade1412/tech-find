import TechnicianList from "../entities/technician/ui/TechnicianList";
import UnitList from "../entities/unit/ui/UnitList";
import BrandSelect from "../features/technician-filter/ui/BrandSelect";

export function HomePage() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <BrandSelect />
          <UnitList />
        </div>
        <div>
          <TechnicianList />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
