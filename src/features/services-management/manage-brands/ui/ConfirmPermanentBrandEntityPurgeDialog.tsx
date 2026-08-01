import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import ConfirmPermanentPurgeDialog from "../../../../shared/ui/ConfirmPermanentPurgeDialog";

export type BrandPurgeTarget =
  | { entity: Brand; type: "brand" }
  | { childCount: number; entity: BrandGroup; type: "brand-group" };

interface ConfirmPermanentBrandEntityPurgeDialogProps {
  error: Error | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  target: BrandPurgeTarget | null;
}

function ConfirmPermanentBrandEntityPurgeDialog({
  error,
  isPending,
  onClose,
  onConfirm,
  target,
}: ConfirmPermanentBrandEntityPurgeDialogProps) {
  const isGroup = target?.type === "brand-group";
  const entityName = target?.entity.name ?? null;

  return (
    <ConfirmPermanentPurgeDialog
      confirmationInputLabel={`${isGroup ? "Brand group" : "Brand"} name confirmation`}
      entityLabel={isGroup ? "brand group" : "brand"}
      entityName={entityName}
      error={error}
      impactMessage={
        isGroup ? (
          <>
            Purging <strong>{entityName}</strong> permanently removes the group,
            all {target.childCount} related
            {target.childCount === 1 ? " brand" : " brands"}, technician
            skills, and ignore-list references.
          </>
        ) : (
          <>
            Purging <strong>{entityName}</strong> permanently removes the brand
            and its technician ignore-list references.
          </>
        )
      }
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmPermanentBrandEntityPurgeDialog;
