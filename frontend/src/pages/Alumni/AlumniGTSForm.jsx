import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { getToken, getUser } from "../../utils/storage";
import { useTheme } from "../../hooks/useTheme";
import GeneralInformation from "../../components/alumni/GeneralInformation";
import EducationalBackground from "../../components/alumni/EducationalBackground";
import TrainingsAndStudies from "../../components/alumni/TrainingsAndStudies";
import EmploymentData from "../../components/alumni/EmploymentData";
import JobSatisfaction from "../../components/alumni/JobSatisfaction";
import Services from "../../components/alumni/Services";
import ProblemsIssuesAndConcerns from "../../components/alumni/ProblemsIssuesAndConcerns";

const sections = [
  { id: "general-information", displayId: "A", label: "General Information", component: GeneralInformation },
  { id: "educational-background", displayId: "B", label: "Educational Attainment (Baccalaureate Degree Only)", component: EducationalBackground },
  { id: "trainings-and-studies", displayId: "C", label: "Training(s) / Advance Studies Attended After College (Optional)", component: TrainingsAndStudies },
  { id: "employment-data", displayId: "D", label: "Employment Data", component: EmploymentData },
  { id: "job-satisfaction", displayId: "E", label: "Job Satisfaction", component: JobSatisfaction },
  { id: "services", displayId: "F", label: "Services", component: Services },
  { id: "problems-issues-concerns", displayId: "G", label: "Problems, Issues & Concerns", component: ProblemsIssuesAndConcerns },
];

const AlumniGTSForm = () => {
  const [gtsData, setGtsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const user = getUser();
  const userId = user?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || sections[0].id;

  const setActiveSection = (newSection) => {
    setSearchParams({ tab: "gts", section: newSection });
  };

  useEffect(() => {
    const fetchGTSData = async () => {
      if (!userId) return;
      try {
        const response = await api.get("/gts_responses/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setGtsData(response.data);
      } catch (error) {
        console.error("Failed to fetch GTS data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGTSData();
  }, [userId]);

  const handleUpdate = async (section, gtsId, updatedFields) => {
    try {
      const response = await api.put(
        `/gts_responses/${gtsId}/${section}`,
        updatedFields,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setGtsData(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to update GTS data:", error);
      return { success: false, message: error.response?.data?.detail };
    }
  };

  if (loading)
    return (
      <div className="py-10 text-lg font-medium text-center">Loading...</div>
    );
  if (!gtsData)
    return (
      <div className="py-10 text-lg font-medium text-center">
        No GTS data found.
      </div>
    );

  const ActiveComponent = sections.find((section) => section.id === activeSection)?.component;

  return (
    <div
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Graduate Tracer Survey Form
        </h1>
        <p
          className={`text-base sm:text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Please fill out each section carefully. You can navigate through the
          form using the section tabs or buttons below.
        </p>
      </header>

      {/* Responsive Section Navigation */}
      <div className="mt-4 sm:hidden">
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className={`w-full p-2 rounded-md border text-sm font-medium ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {`${section.displayId}. ${section.label}`}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation (Desktop) */}
      <div className="flex-wrap justify-center hidden gap-2 pb-4 border-b border-gray-300 sm:flex dark:border-gray-700">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors ${
              activeSection === section.id
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {section.displayId}
          </button>
        ))}
      </div>

      {/* Active Section Title */}
      <h2 className="text-lg font-semibold text-center sm:text-xl sm:text-left">
        {sections.find((section) => section.id === activeSection)?.label}
      </h2>

      {/* Active Section Content */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md transition-colors duration-300 ${
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
      <div className="flex flex-col justify-between gap-3 pt-4 sm:flex-row">
        <button
         onClick={() => {
            const currentIndex = sections.findIndex((s) => s.id === activeSection);
            if (currentIndex > 0) setActiveSection(sections[currentIndex - 1].id);
          }}
          disabled={activeSection === sections[0].id}
          className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          } disabled:opacity-50`}
        >
          Previous
        </button>

        <button
          onClick={() => {
            const currentIndex = sections.findIndex((s) => s.id === activeSection);
            if (currentIndex < sections.length - 1) setActiveSection(sections[currentIndex + 1].id); 
          }}
          disabled={activeSection === sections[sections.length - 1].id}
          className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition-colors ${
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
