import { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext();

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [userUSN, setUserUSN] = useState(localStorage.getItem("userUSN") || null);
    const [mentorID, setMentorID] = useState(localStorage.getItem("mentorID") || null);

    // Function to log in (store USN or mentorID)
    const login = ({ usn, mentorID }) => {
        if (usn) {
            setUserUSN(usn);
            localStorage.setItem("userUSN", usn);
        }
        if (mentorID) {
            setMentorID(mentorID);
            localStorage.setItem("mentorID", mentorID);
        }
    };

    // Function to log out (clear both USN and mentorID)
    const logout = () => {
        setUserUSN(null);
        setMentorID(null);
        localStorage.removeItem("userUSN");
        localStorage.removeItem("mentorID");
    };

    return (
        <AuthContext.Provider value={{ userUSN, mentorID, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
