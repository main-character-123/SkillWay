import { useState, useEffect } from "react";
import { Axios } from "../../../../api/axios";
import { Outlet } from "react-router-dom";
import { tracksAPI } from "../../../../api/Api";
import { toast } from "react-toastify";

const TracksPage = () => {
  const [tracks, setTracks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchTracks();
  }, [refreshKey]);

  const fetchTracks = async () => {
    try {
      const { data } = await Axios.get(tracksAPI);
      setTracks(data.data.tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${tracksAPI}/${id}`);
      fetchTracks();
      toast.success("Track deleted successfully.");
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error(error?.response?.data?.error || "Couldn't delete track.");
    }
  };

  return (
    <div className="mt-4">
      {/* Default view is TracksList */}
      <Outlet context={{ tracks, handleDelete, setRefreshKey }} />
    </div>
  );
};

export default TracksPage;
