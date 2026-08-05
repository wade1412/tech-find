import { useParams } from "react-router";
import { useBrandGroupQuery } from "../../entities/brandGroup/useBrandGroupQuery";
import NotFoundPage from "../NotFoundPage";
import { InlineSpinner } from "../../shared/ui/Spinners";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import BrandGroupForm from "../../features/services-management/manage-brands/ui/BrandGroupForm";
import ArchiveBrandGroupWithConfirmationButton from "../../features/services-management/manage-brands/ui/ArchiveBrandGroupWithConfirmationButton";

function EditBrandGroupPage() {
  const { brandGroupId } = useParams<{ brandGroupId: string }>();
  const {
    data: brandGroup,
    isPending,
    isError,
    error,
  } = useBrandGroupQuery(brandGroupId);

  if (!brandGroupId) return <NotFoundPage />;
  if (isPending) return <InlineSpinner />;

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  if (!brandGroup) return <NotFoundPage />;

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={brandGroup.name}
            subtitle={`Edit brand group details · ${brandGroup.slug}`}
          />

          <ArchiveBrandGroupWithConfirmationButton brandGroup={brandGroup} />
        </div>

        <BrandGroupForm key={brandGroup.id} brandGroup={brandGroup} />
      </section>
    </div>
  );
}

export default EditBrandGroupPage;
