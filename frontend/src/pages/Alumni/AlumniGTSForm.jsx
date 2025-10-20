// Main Wrapper for GTS Form
import { useEffect, useState } from "react";
import api from "../../services/api";
import { getToken, getUser } from "../../utils/storage";
import GeneralInformation from "../../components/alumni/GeneralInformation";
import EmploymentData from "../../components/alumni/EmploymentData";

const AlumniGTSForm = () => {
  const [gtsData, setGtsData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <div>Loading...</div>;
  if (!gtsData) return <div>No GTS data found.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Graduate Tracer Study Form</h1>

      {/* Each section gets the current data and update handler */}
      <GeneralInformation gtsData={gtsData} onUpdate={handleUpdate} />
      <EmploymentData gtsData={gtsData} onUpdate={handleUpdate} />
      {/* Add more sections as needed */}
    </div>
  );
};

export default AlumniGTSForm;
