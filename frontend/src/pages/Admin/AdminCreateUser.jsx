import { getToken } from "../../utils/storage";
import { useState } from "react";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import UsernameInput from "../../components/UsernameInput";
import FloatingInput from "../../components/FloatingInput";
import FloatingSelect from "../../components/FloatingSelect";

const AdminCreateUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    registerIdentifier: "",
    registerPassword: "",
    registerConfirmPassword: "",
    lastName: "",
    firstName: "",
    middleInitial: "",
    nameExtension: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const validate = () => {
    const validateErrors = {};
    if (!formData.email) 
      validateErrors.email = "Email is required";
    if (!formData.registerIdentifier?.trim())
      validateErrors.registerIdentifier = "Username is required";
    else if (usernameAvailable === false)
      validateErrors.registerIdentifier = "Username is already taken";
    if (!formData.lastName) 
      validateErrors.lastName = "Last name is required";
    if (!formData.firstName)
      validateErrors.firstName = "First name is required";
    if (!formData.registerPassword)
      validateErrors.registerPassword = "Password is required";
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
    const submitErrors = validate();
    if (Object.keys(submitErrors).length) {
      setErrors(submitErrors);
      return;
    }
    setErrors({});

    try {
      const payload = { ...formData };
      delete payload.registerConfirmPassword;
      await api.post("/users/admin/create-user", payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
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
      });
    } catch (error) {
      setMessage(error.response?.data?.detail || "Creation failed");
    }
  };

  return (
    <>
      <div>
        <p className="text-lg font-semibold mb-4">
          On this page, Admin can create another admin account.
        </p>
        <p className="text-sm mb-6">
          Note: You can only create one admin account.
        </p>
      </div>

      <div className="space-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Create User
          </h2>

          <div className="space-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatingInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                label="Email"
                error={errors.email}
              />

              <UsernameInput
                id="registerIdentifier"
                value={formData.registerIdentifier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registerIdentifier: e.target.value,
                  })
                }
                error={errors.registerIdentifier}
                onAvailabilityChange={setUsernameAvailable}
              />
            </div>
          </div>

          <div className="space-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                onChange={(e) =>
                  setFormData({ ...formData, middleInitial: e.target.value })
                }
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
          </div>

          <div className="space-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatingInput
                id="registerPassword"
                type={showPassword ? "text" : "password"}
                value={formData.registerPassword}
                onChange={(e) =>
                  setFormData({ ...formData, registerPassword: e.target.value })
                }
                label="Password"
                error={errors.registerPassword}
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
                className={`text-sm mt-1 ${
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
          >
            Create User
          </button>

          {message && (
            <p className="text-center text-sm text-green-600 mt-2">{message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default AdminCreateUser;
