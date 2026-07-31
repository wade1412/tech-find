import { useParams } from "react-router";
import { useBrandQuery } from "../../entities/brand/useBrandQuery";
import NotFoundPage from "../NotFoundPage";
import { InlineSpinner } from "../../shared/ui/Spinners";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import BrandForm from "../../features/services-management/manage-brands/ui/BrandForm";
import { useBrandGroupsQuery } from "../../entities/brandGroup/useBrandGroupsQuery";
import ArchiveBrandWithConfirmationButton from "../../features/services-management/manage-brands/archive-brand/ui/ArchiveBrandWithConfirmationButton";
function EditBrandPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const {
    data: brand,
    isPending: isBrandPending,
    isError: isBrandError,
    error: brandError,
  } = useBrandQuery(brandId);
  const {
    data: brandGroups,
    isPending: isBrandGroupsPending,
    isError: isBrandGroupsError,
    error: brandGroupsError,
  } = useBrandGroupsQuery("all");

  const isPending = isBrandPending || isBrandGroupsPending;
  const isError = isBrandError || isBrandGroupsError;
  const error = brandError ?? brandGroupsError;

  if (!brandId) return <NotFoundPage />;
  if (isPending) return <InlineSpinner />;

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  if (!brand) return <NotFoundPage />;

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={brand.name}
            subtitle={`Edit brand details · ${brand.slug}`}
          />

          <ArchiveBrandWithConfirmationButton brand={brand} />
        </div>

        <BrandForm key={brand.id} brand={brand} brandGroups={brandGroups} />
      </section>
    </div>
  );
}

export default EditBrandPage;
