import TechnicianList from "../entities/technician/ui/TechnicianList";
import FilterPanel from "../features/technician-filter/ui/FilterPanel";
import { headingStyle } from "../shared/styles/styles";

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Dispatch Board
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Select units and assign technicians
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column - filtering options: Units, Brands and others */}
        <div className="flex flex-col gap-5">
          <FilterPanel />
        </div>

        {/* Right Column - Technicians List */}
        <section>
          <h2 className={headingStyle}>Technicians</h2>
          <TechnicianList />
        </section>
      </div>
    </div>
  );
}

export default HomePage;
