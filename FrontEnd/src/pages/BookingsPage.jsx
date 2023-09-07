import { useEffect } from "react";
import ProfileNav from "../ProfileNav";
import { useState } from "react";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "../Image";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [alreadyLoaded, setAlreadyLoaded] = useState(false);
    useEffect(() => {

        //TODO remove <React.StrictMode> from main.jsx as useEffect gets triggered twice
        //                                             => toast shows 2 times
        const query = new URLSearchParams(window.location.search);
        if (query && !alreadyLoaded) {
            const succParam = query.get("success");
            if (succParam === 'true') {
                toast.success('Successfully created booking!', {
                    position: "bottom-center",
                });
            }
        }

        let accessToken = localStorage.getItem('token');
        const headers = {
            'token': accessToken
        }
        axios.get('/bookings', { headers: headers }).then(({ data }) => {
            setBookings(data);
        }).catch(err => {
            alert(`Could not fetch bookings! ${err}`);
        });
    }, [deleted]);

    async function cancelReservation(booking) {
        console.log(booking);
        if ((new Date(booking.checkInDate)) > new Date()) {
            if (confirm(`Are you sure you want to delete this reservation?`)) {
                try {
                    const { data } = await axios.delete(`/bookings/${booking._id}`);

                    setDeleted(true);
                    setAlreadyLoaded(true);

                    toast.success('Successfully cancelled reservation!', {
                        position: "bottom-center",
                    });
                } catch (err) {
                    alert(`Could not cancel reservation! ${err}`)
                }
            }
        } else {
            alert(`You can only cancel reservations that are in the future!`)
        }
    }

    return (
        <div>
            <ProfileNav />
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                    <div className="flex gap-5 bg-gray-200 rounded-2xl overflow-hidden mt-4" key={booking._id}>
                        <div className="w-48">
                            {booking.placeId.photos.length > 0 && (
                                <Image className="aspect-square object-cover h-full" src={booking.placeId.photos[0]} />
                            )}
                        </div>
                        <div className="py-4 text-xl">
                            <h2 className="text-2xl font-bold border-b border-gray-300 pb-2">{booking.placeId.title}</h2>
                            <div className="py-2 flex gap-2 items-center mt-1">
                                <div className="flex gap-1 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                    </svg>

                                    {format(new Date(booking.checkInDate), 'dd-MM-yyyy')}
                                </div>

                                &rarr;

                                <div className="flex gap-1 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                    </svg>

                                    {format(new Date(booking.checkOutDate), 'dd-MM-yyyy')}
                                </div>

                            </div>
                            <div className="mt-1">
                                No. of reserved nights: {differenceInCalendarDays(new Date(booking.checkOutDate), new Date(booking.checkInDate))} <br />
                                {booking.noGuests} Guest(s) <br />
                                Price: €{booking.price}
                            </div>
                        </div>
                        {new Date(booking.checkInDate) > new Date() && (
                            <button onClick={() => cancelReservation(booking)} className="absolute cursor-pointer right-10 text-white p-2 bg-gray-500 bg-opacity-70 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <ToastContainer closeOnClick position="bottom-center" />
        </div>
    );
}