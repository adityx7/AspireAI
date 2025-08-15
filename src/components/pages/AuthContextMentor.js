import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userMentorID, setUserMentorID] = useState(localStorage.getItem("userMentorID") || null);

    // Function to log in (store MentorID)
    const login = (MentorID) => {
        setUserMentorID(MentorID);
        localStorage.setItem("userMentorID", MentorID);
    };

    // Function to log out
    const logout = () => {
        setUserMentorID(null);
        localStorage.removeItem("userMentorID");
    };

    return (
        <AuthContext.Provider value={{ userMentorID, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
