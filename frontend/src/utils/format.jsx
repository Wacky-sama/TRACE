export const formatFullname = (user) => {
  if (!user) return "";

  const parts = [
    user.firstname || "",
    user.middle_initial ? `${user.middle_initial}.` : "",
    user.lastname || "",
    user.name_extension || ""
  ];

  return parts.filter(Boolean).join(" ");
};
