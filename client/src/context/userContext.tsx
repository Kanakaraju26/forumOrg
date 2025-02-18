import { createContext, useContext, useState, ReactNode } from "react";

// Define user data type
interface UserData {
  email: string;
}

// Define context type
interface UserContextType {
  userData: UserData | null;
  password: string; // Password state
  fetchUser: () => void; // Fetch user from API
  logoutUser: () => void;
  setPassword: (password: string) => void; // Set password function
  clearPassword: () => void; // Clear password function
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [password, setPassword] = useState<string>(""); // State for storing password temporarily

  // Fetch user from API (instead of localStorage)
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        credentials: "include", 
      });

      if (response.ok) {
        const user = await response.json();
        setUserData(user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserData(null);
    }
  };

  // Logout function
  const logoutUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUserData(null); 
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Function to set password
  const handleSetPassword = (newPassword: string) => {
    setPassword(newPassword);
  };

  // Function to clear password (e.g., after password reset)
  const handleClearPassword = () => {
    setPassword("");
  };

  return (
    <UserContext.Provider value={{ userData, password, fetchUser, logoutUser, setPassword: handleSetPassword, clearPassword: handleClearPassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
