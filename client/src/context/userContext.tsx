import { createContext, useContext, useState, ReactNode } from "react";

// Define the user data type
interface UserData {
  email: string;
  password: string;
}

// Define context type
interface UserContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

// Create context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Context Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>({ email: "", password: "" });

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

// Custom Hook to Use the Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
