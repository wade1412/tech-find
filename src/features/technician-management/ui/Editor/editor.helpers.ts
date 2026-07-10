export const getSelectOptionsFromEntity = (
  entity: { name: string; id: string }[],
) => entity.map((element) => ({ label: element.name, value: element.id }));
