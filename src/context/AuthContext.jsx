import { createContext, useState, useEffect, useContext } from "react";
import axiosConfig from "@/context/axiosConfig.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                try {
                    const response = await axiosConfig.get("/user/profile");

                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    // If token is invalid, clear it
                    localStorage.removeItem("token");
                    delete axiosConfig.defaults.headers.common["Authorization"];
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const register = async (firstName, lastName, email, password) => {
        const response = await axiosConfig.post("/user", {
            firstName,
            lastName,
            email,
            password
        });

        const loginResponse = await axiosConfig.post("/login_check", {
            email,
            password
        });

        const token = loginResponse.data.token;

        localStorage.setItem("token", token);

        console.log(token)

        axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const userResponse = await axiosConfig.get("/user/profile/");
        setUser(userResponse.data);
        setIsAuthenticated(true);

        return userResponse.data;
    };

    const login = async (email, password) => {
        const response = await axiosConfig.post("/login_check", {
            email,
            password
        });

        const token = response.data.token;

        localStorage.setItem("token", token);

        console.log(token)

        axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const userResponse = await axiosConfig.get("/user/profile/");
        setUser(userResponse.data);
        setIsAuthenticated(true);

        return userResponse.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axiosConfig.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
