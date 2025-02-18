import { Button } from "@mui/material";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const { userData, logoutUser, fetchUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      await fetchUser(); // ✅ Fetch user data on component mount
    };
    getUser();
  }, [fetchUser]); // ✅ Add fetchUser in dependency array

  const handleLogout = () => {
    logoutUser(); // ✅ Clears user data and logs out
  };

  return (
    <div>
      {userData ? (
        <>
          <h1>Welcome, {userData.email}!</h1>
          <p>You are successfully logged in.</p>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </>
      )}
    </div>
  );
};

export default Home;
