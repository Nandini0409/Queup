export function validateLead(
  name,
  profileUrl
) {
  const errors = {};

  if (!name.trim()) {
    errors.name =
      "Lead name is required";
  }

  if (!profileUrl.trim()) {
    errors.profile =
      "Profile URL is required";
  }

  return errors;
}