import { useUnitsQuery } from "../useUnitsQuery";

function UnitList() {
  const { data, isPending, isError, error } = useUnitsQuery();

  return (
    <div>
      {isPending && <h1>Loading...</h1>}

      {isError && <p>{error.message}</p>}

      {data && data.length > 0 && (
        <ul>
          {data.map((unit) => (
            <li key={unit.id}>{unit.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UnitList;
