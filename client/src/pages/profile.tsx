import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/"); // Redirect to home if not authorized
        return;
      }

      if (response.ok) {
        const user = await response.json();
        console.log("User:", user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/"); // Redirect to home on error
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <div>Profile Page</div>;
};

export default Profile;
