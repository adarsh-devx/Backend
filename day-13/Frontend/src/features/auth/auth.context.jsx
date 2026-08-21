import { createContext, useState, useEffect } from "react";
import { getmeApi } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getmeApi();
                // Set authenticated user if active session exists
                setUser(res?.user || res?.data?.user || null);
            } catch (err) {
                console.log("No active session found:", err.message);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;