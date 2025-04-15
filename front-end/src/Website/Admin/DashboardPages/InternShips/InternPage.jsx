import { useState, useEffect } from "react";
import { Axios } from "../../../../api/axios";
import { Outlet } from "react-router-dom";
import { internshipsAPI } from "../../../../api/Api";
import { toast } from "react-toastify";

export default function InternPage() {
  const [interns, setInterns] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchInterns();
  }, [refreshKey]);

  const fetchInterns = async () => {
    try {
      const { data } = await Axios.get(internshipsAPI);
      setInterns(data.interns);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${internshipsAPI}/${id}`);
      fetchInterns();
      toast.success("Internship deleted successfully.");
    } catch (error) {
      console.error("Error deleting internships:", error);
      toast.error(
        error?.response?.data?.error || "Couldn't delete internship."
      );
    }
  };

  return (
    <div className="mt-4">
      {/* Default view is InternList */}
      <Outlet context={{ interns, handleDelete, setRefreshKey }} />
    </div>
  );
}
