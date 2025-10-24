import { getToken } from "../../utils/storage";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import UsernameInput from "../../components/UsernameInput";
import FloatingInput from "../../components/FloatingInput";
import FloatingSelect from "../../components/FloatingSelect";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const AdminCreateUser = () => {
  const isDark = useDarkMode();

  const [formData, setFormData] = useState({
    email: "",
    registerIdentifier: "",
    registerPassword: "",
    registerConfirmPassword: "",
    lastName: "",
    firstName: "",
    middleInitial: "",
    nameExtension: "",
    sex: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const capitalizeEachWord = (str) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const validate = () => {
    const validateErrors = {};
    if (!formData.email?.trim()) validateErrors.email = "Email is required";
    if (!formData.registerIdentifier?.trim())
      validateErrors.registerIdentifier = "Username is required";
    else if (usernameAvailable === false)
      validateErrors.registerIdentifier = "Username is already taken";
    if (!formData.lastName?.trim()) validateErrors.lastName = "Last name is required";
    if (!formData.firstName?.trim()) validateErrors.firstName = "First name is required";
    if (!formData.sex) validateErrors.sex = "Sex is required";  // Add this
    if (!formData.registerPassword) validateErrors.registerPassword = "Password is required";
    if (!formData.registerConfirmPassword)
      validateErrors.registerConfirmPassword = "Confirm Password is required";
    if (
      formData.registerPassword &&
      formData.registerConfirmPassword &&
      formData.registerPassword !== formData.registerConfirmPassword
    ) {
      validateErrors.registerConfirmPassword = "Passwords do not match";
    }
    setErrors(validateErrors);
    return Object.keys(validateErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    // Explicitly map frontend keys to backend-expected keys
    const payload = {
      username: formData.registerIdentifier,
      email: formData.email,
      password: formData.registerPassword,
      lastname: formData.lastName,
      firstname: formData.firstName,
      middle_initial: formData.middleInitial,
      name_extension: formData.nameExtension,
      role: "admin",
      sex: formData.sex,  // Add this
    };

    console.log("Payload being sent:", payload);  // For debugging

    try {
      const response = await api.post("/users/admin/create-user", payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Success response:", response);  // For debugging
      setMessage("User created successfully!");
      setFormData({
        registerIdentifier: "",
        email: "",
        registerPassword: "",
        registerConfirmPassword: "",
        lastName: "",
        firstName: "",
        middleInitial: "",
        nameExtension: "",
        sex: "",  // Reset this
      });
    } catch (error) {
      console.error("Error response:", error.response);  // For debugging
      // Stringify the error object to make it renderable
      const errorMsg = error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : "Creation failed";
      setMessage(errorMsg);
    }
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      } min-h-screen p-6`}
    >
      <div>
        <p className="mb-4 text-lg font-semibold">
          On this page, Admin can create another admin account.
        </p>
        <p className="mb-6 text-sm">
          Note: You can only create one admin account.
        </p>

        <form
          onSubmit={handleSubmit}
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 shadow-md rounded-lg`}
        >
          <h2
            className={`text-xl font-semibold border-b pb-2 mb-4 ${
              isDark
                ? "text-gray-100 border-gray-700"
                : "text-gray-800 border-gray-200"
            }`}
          >
            Create User
          </h2>

          <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-2">
            <FloatingInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value.toLowerCase() })
              }
              label="Email"
              error={errors.email}
            />

            <UsernameInput
              id="registerIdentifier"
              value={formData.registerIdentifier}
              onChange={(e) =>
                setFormData({ ...formData, registerIdentifier: e.target.value.toLowerCase() })
              }
              error={errors.registerIdentifier}
              onAvailabilityChange={setUsernameAvailable}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-3">
            <FloatingInput
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              label="Last Name"
              error={errors.lastName}
            />
            <FloatingInput
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              label="First Name"
              error={errors.firstName}
            />
            <FloatingInput
            id="middleInitial"
            value={formData.middleInitial || ""}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-Z]?$/.test(value)) {
                setFormData({ ...formData, middleInitial: value });
              }
            }}
            label="Middle Initial"
            error={errors.middleInitial}
          />
          </div>

          <FloatingSelect
            id="nameExtension"
            value={formData.nameExtension || ""}
            onChange={(e) =>
              setFormData({ ...formData, nameExtension: e.target.value })
            }
            label="Name Extension (e.g., Jr., Sr., III)"
            placeholder="None"
            error={errors.nameExtension}
            options={["Jr.", "Sr.", "II", "III", "IV", "V"]}
          />

          <FloatingSelect
            id="sex"
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            label="Sex"
            error={errors.sex}
            options={["Male", "Female"]}
          />

          <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-2">
            <FloatingInput
              id="registerPassword"
              type={showPassword ? "text" : "password"}
              value={formData.registerPassword}
              onChange={(e) =>
                setFormData({ ...formData, registerPassword: e.target.value })
              }
              label="Password"
              error={errors.registerPassword}
              darkMode={isDark}
            >
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </FloatingInput>

            <FloatingInput
              id="registerConfirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.registerConfirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registerConfirmPassword: e.target.value,
                })
              }
              label="Confirm Password"
              error={errors.registerConfirmPassword}
            >
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                />
              </span>
            </FloatingInput>
          </div>

          {formData.registerPassword && formData.registerConfirmPassword && (
            <p
              className={`text-sm mt-1 text-center ${
                formData.registerPassword === formData.registerConfirmPassword
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formData.registerPassword === formData.registerConfirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-4 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create User
          </button>

          {message && (
            <p className="mt-2 text-sm text-center text-red-600 whitespace-pre-wrap">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;