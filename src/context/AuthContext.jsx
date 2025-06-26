import { createContext, useState, useEffect, useContext } from "react";
import axiosConfig from "@/context/axiosConfig.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                try {
                    const response = await axiosConfig.get("/user/profile");

                    setUser({ ...response.data, token });
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Auth check failed:", error);
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

        setRegisteredEmail(email);

        return response.data;
    };

    const login = async (email, password) => {
        const response = await axiosConfig.post("/login_check", {
            email,
            password
        });

        const token = response.data.token;

        axiosConfig.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const userResponse = await axiosConfig.get("/user/profile");

        if (!userResponse.data.isVerified) {
            delete axiosConfig.defaults.headers.common["Authorization"];

            throw new Error("Veuillez vérifier votre adresse e-mail avant de vous connecter. Consultez votre boîte de réception pour le lien de confirmation.");
        }

        localStorage.setItem("token", token);

        const userWithToken = { ...userResponse.data, token };
        setUser(userWithToken);
        setIsAuthenticated(true);

        return userWithToken;
    };

    const resendVerificationEmail = async (email) => {
        try {
            await axiosConfig.post("/resend-verification", { email });
            return true;
        } catch (error) {
            console.error("Failed to resend verification email:", error);
            throw error;
        }
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
                logout,
                registeredEmail,
                resendVerificationEmail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
