import React, { useState, useEffect } from "react";
import { Axios } from "../../../../api/axios";
import { coursesAPI } from "../../../../api/Api";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, [refreshKey]);

  const fetchCourses = async () => {
    try {
      const { data } = await Axios.get(coursesAPI);
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${coursesAPI}/${id}`);
      toast.success("Course deleted successfully.");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Couldn't delete course.");
    }
  };

  return (
    <div className="mt-4">
      {/* Default view is CourseList */}
      <Outlet context={{ courses, handleDelete, setRefreshKey }} />
    </div>
  );
};

export default CoursesPage;
