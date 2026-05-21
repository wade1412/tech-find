import { useTechniciansQuery } from "../entities/technician/useTechniciansQuery";

export function HomePage() {
  const { data, isPending, isError, error } = useTechniciansQuery();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
      {isPending && <h1>Loading...</h1>}

      {isError && <p>{error.message}</p>}

      {data && data.length > 0 && (
        <ul>
          {data.map((tech) => (
            <li key={tech.id}>{tech.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
