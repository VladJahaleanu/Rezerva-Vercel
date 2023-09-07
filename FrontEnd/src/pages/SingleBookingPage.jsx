import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SingleBookingPage() {
    const { id } = useParams();
    useEffect(() => {

        //TODO remove <React.StrictMode> from main.jsx as useEffect gets triggered twice
        //                                             => toast shows 2 times
        const query = new URLSearchParams(window.location.search);
        if (query) {
            const succParam = query.get("success");
            if (succParam === 'true') {
                toast.success('Successfully created booking!', {
                    position: "bottom-center",
                });
            }
        }
    }, []);

    return (
        <div>single booking page for {id}
            <ToastContainer closeOnClick autoClose={false} position="bottom-center" />
        </div>


    );
}