// Main Wrapper for GTS Form
import { useEffect, useState } from "react";
import api from "../../services/api";
import { getToken, getUser } from "../../utils/storage";
import { useTheme } from "../../context/ThemeProvider";
import GeneralInformation from "../../components/alumni/GeneralInformation";
import EducationalBackground from "../../components/alumni/EducationalBackground";
import TrainingsAndStudies from "../../components/alumni/TrainingsAndStudies";
import EmploymentData from "../../components/alumni/EmploymentData";
import JobSatisfaction from "../../components/alumni/JobSatisfaction";
import Services from "../../components/alumni/Services";
import ProblemsIssuesAndConcerns from "../../components/alumni/ProblemsIssuesAndConcerns";

const sections = [
  { id: "A", component: GeneralInformation },
  { id: "B", component: EducationalBackground },
  { id: "C", component: TrainingsAndStudies },
  { id: "D", component: EmploymentData },
  { id: "E", component: JobSatisfaction },
  { id: "F", component: Services },
  { id: "G", component: ProblemsIssuesAndConcerns },
];

const AlumniGTSForm = () => {
  const [gtsData, setGtsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("A");
  const { theme } = useTheme();
  const user = getUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchGTSData = async () => {
      if (!userId) return;
      try {
        const response = await api.get("/gts_responses/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setGtsData(response.data);
      } catch (error) {
        console.error("Failed to fetch GTS data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGTSData();
  }, [userId]);

  const handleUpdate = async (section, updatedFields) => {
    try {
      const response = await api.put(
        `/gts_responses/${gtsData.id}/${section}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setGtsData(response.data);
      return { success: true };
    } catch (error) {
      console.error("Failed to update GTS data:", error);
      return { success: false, message: error.response?.data?.detail };
    }
  };

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (!gtsData)
    return <div className="py-8 text-center">No GTS data found.</div>;

  const ActiveComponent = sections.find(
    (section) => section.id === activeSection
  )?.component;

  return (
    <div
      className={`max-w-5xl mx-auto px-4 py-8 space-y-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center">
        Graduate Tracer Survey Form
      </h1>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-2 pb-4 border-b border-gray-300 dark:border-gray-700">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeSection === section.id
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {section.id}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-semibold">
        {sections.find((section) => section.id === activeSection)?.label}
      </h2>

      {/* Section Content */}
      <div
        className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        {ActiveComponent && (
          <ActiveComponent gtsData={gtsData} onUpdate={handleUpdate} />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => {
            const currentIndex = sections.findIndex(
              (s) => s.id === activeSection
            );
            if (currentIndex > 0)
              setActiveSection(sections[currentIndex - 1].id);
          }}
          disabled={activeSection === "A"}
          className={`px-4 py-2 rounded-md transition-colors ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          } disabled:opacity-50`}
        >
          Previous
        </button>

        <button
          onClick={() => {
            const currentIndex = sections.findIndex(
              (s) => s.id === activeSection
            );
            if (currentIndex < sections.length - 1)
              setActiveSection(sections[currentIndex + 1].id);
          }}
          disabled={activeSection === "G"}
          className={`px-4 py-2 rounded-md transition-colors ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          } disabled:opacity-50`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AlumniGTSForm;
