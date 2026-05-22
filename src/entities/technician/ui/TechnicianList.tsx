import { useTechniciansQuery } from "../useTechniciansQuery";

function TechnicianList() {
  const { data, isPending, isError, error } = useTechniciansQuery();

  return (
    <div>
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

export default TechnicianList;
