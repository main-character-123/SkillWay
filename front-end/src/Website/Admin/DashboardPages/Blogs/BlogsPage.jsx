import React, { useState, useEffect } from "react";
import { Axios } from "../../../../api/axios";
import { blogsAPI } from "../../../../api/Api";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, [refreshKey]);

  const fetchBlogs = async () => {
    try {
      const { data } = await Axios.get(blogsAPI);
      setBlogs(data.Blogs);
    } catch (error) {
      console.error("Error fetching Blogs:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${blogsAPI}/${id}`);
      toast.success("Blog deleted successfully.");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Couldn't delete blog.");
    }
  };

  return (
    <div className="mt-4">
      {/* Default view is BlogList */}
      <Outlet context={{ blogs, handleDelete, setRefreshKey }} />
    </div>
  );
};

export default BlogsPage;
