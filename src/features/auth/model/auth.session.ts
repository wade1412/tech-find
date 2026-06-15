interface ShouldLoadProfileParams {
  userId: string;
  profileUserId?: string;
  resolvingUserId?: string;
  force?: boolean;
}

export const shouldLoadProfile = ({
  userId,
  profileUserId,
  resolvingUserId,
  force = false,
}: ShouldLoadProfileParams) => {
  if (resolvingUserId === userId) return false;
  if (force) return true;

  return profileUserId !== userId;
};
