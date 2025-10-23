export const isStrongPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "Enter a password" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  // Normalize to 0–4
  if (score >= 5) score = 4;

  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  return { score, label: labels[score] };
};

export const getPasswordStrengthMessage = (password) => {
  if (!password) return "Password is required";

  const lengthValid = password.length >= 8;
  const upperValid = /[A-Z]/.test(password);
  const lowerValid = /[a-z]/.test(password);
  const numberValid = /\d/.test(password);
  const specialValid = /[!@#$%^&*]/.test(password);

  const unmet = [];
  if (!lengthValid) unmet.push("at least 8 characters");
  if (!upperValid) unmet.push("an uppercase letter");
  if (!lowerValid) unmet.push("a lowercase letter");
  if (!numberValid) unmet.push("a number");
  if (!specialValid) unmet.push("a special character (!@#$%^&*)");

  return unmet.length
    ? `Password must include ${unmet.join(", ")}.`
    : "Strong password";
};
