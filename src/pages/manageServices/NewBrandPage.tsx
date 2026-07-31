import { useBrandGroupsQuery } from "../../entities/brandGroup/useBrandGroupsQuery";
import BrandForm from "../../features/services-management/manage-brands/ui/BrandForm";
import {
  centeredContainerStyle,
  formStyle,
} from "../../shared/styles/styles";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import PageHeader from "../../shared/ui/PageHeader";
import { InlineSpinner } from "../../shared/ui/Spinners";

function NewBrandPage() {
  const {
    data: brandGroups,
    isPending,
    isError,
    error,
  } = useBrandGroupsQuery("active");

  if (isPending) return <InlineSpinner />;

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <PageHeader
          title="New Brand"
          subtitle="Create a brand and assign it to an active brand group"
        />

        <BrandForm brandGroups={brandGroups} />
      </section>
    </div>
  );
}

export default NewBrandPage;
