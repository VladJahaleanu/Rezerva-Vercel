import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";

export const UserContext = createContext({});

let accessToken = localStorage.getItem('token');
const headers = {
    'token': accessToken
}


export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!user) {
            if (accessToken) {
                axios.get('/profile', { headers: headers }).then(({ data }) => {
                    setUser(data);
                    setReady(true);
                });
            }
        }
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}