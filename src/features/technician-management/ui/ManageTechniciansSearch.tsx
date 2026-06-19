interface ManageTechniciansSearchProps {
  value: string;
  onValueChange: (value: string) => void;
}

function ManageTechniciansSearch({
  value,
  onValueChange,
}: ManageTechniciansSearchProps) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        type="text"
        placeholder="Search for a technician..."
      />
    </div>
  );
}

export default ManageTechniciansSearch;
