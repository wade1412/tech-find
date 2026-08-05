import type { User } from "../../../entities/user/user.types";
import { normalizeSearchText } from "../../../shared/model/helpers";
import type { UserStatusFilterValue } from "./userListFilters.constants";

type FilterUsersParams = {
  users: User[];
  searchTerm: string;
  status: UserStatusFilterValue;
};

export const filterUsers = ({
  users,
  searchTerm,
  status,
}: FilterUsersParams) => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm ? normalizedSearchTerm.split(" ") : [];

  return users.filter((user) => {
    const matchesStatus =
      status === "all" || user.active === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const searchableText = normalizeSearchText(
      [
        user.alias,
        user.email,
        user.full_name,
        user.role,
      ].join(" "),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};
