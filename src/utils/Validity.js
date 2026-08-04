export function validateLead(formData) {
  const errors = {};

  // Lead Name
  if (!formData.name.trim()) {
    errors.name = "Lead name is required.";
  }

  // LinkedIn Profile URL
  if (!formData.profile_link.trim()) {
    errors.profile_link = "LinkedIn profile URL is required.";
  } else {
    try {
      const url = new URL(formData.profile_link);

      if (!url.hostname.includes("linkedin.com")) {
        errors.profile_link =
          "Please enter a valid LinkedIn profile URL.";
      }
    } catch {
      errors.profile_link =
        "Please enter a valid URL.";
    }
  }

  // Followers
  if (
    formData.followers_count &&
    (isNaN(Number(formData.followers_count)) ||
      Number(formData.followers_count) < 0)
  ) {
    errors.followers_count =
      "Followers must be a positive number.";
  }

  // Connections
  if (
    formData.connections_count &&
    (isNaN(Number(formData.connections_count)) ||
      Number(formData.connections_count) < 0)
  ) {
    errors.connections_count =
      "Connections must be a positive number.";
  }

  return errors;
}



export function isLeadFormValid(formData) {
  return (
    formData.name.trim() !== "" &&
    formData.profile_link.trim() !== ""
  );
}