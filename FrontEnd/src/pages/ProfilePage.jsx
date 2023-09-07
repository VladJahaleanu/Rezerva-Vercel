import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useParams, Navigate } from "react-router-dom";
import AccommodationsPage from "./AccommodationsPage";
import ProfileNav from "../ProfileNav";

export default function ProfilePage() {
    const [redirect, setRedirect] = useState(false);
    const { ready, user, setUser } = useContext(UserContext);

    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile'
    }

    // if (!ready) {
    //     return 'Loading...';
    // }

    if (ready && !user) {
        return <Navigate to={'/login'} />
    }

    

    function logout() {
        localStorage.removeItem('token');
        setUser(null);
        setRedirect(true);

    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div>
            <ProfileNav />
            {subpage === 'profile' && (
                <div className="text-center">
                    Logged in as {user.userName} [{user.email}] <br />
                    <button onClick={logout} className="bg-primary text-white rounded-full mt-5 logoutBtn max-w-sm">
                        Logout
                    </button>
                </div>
            )}

            {subpage === 'accommodations' && (
                <AccommodationsPage />
            )}
        </div>
    );
}