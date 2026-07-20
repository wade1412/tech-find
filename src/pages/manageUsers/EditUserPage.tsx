import { useParams } from "react-router";

function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();

  return <div>{`EditUserPage - ${userId ?? "Missing user id"}`}</div>;
}

export default EditUserPage;
