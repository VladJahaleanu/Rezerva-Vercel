import axios from "axios";
import { differenceInCalendarDays, parseISO, format, addDays } from "date-fns";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css';
import ReactDatePicker from "react-datepicker";


export default function BookingTab({ accommodation }) {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [noGuests, setNoGuests] = useState(1);
    const [redirect, setRedirect] = useState('');
    const [unavailableDates, setUnavailableDates] = useState([]);

    useEffect(() => {
        var excludedDatesArr = [];
        //Get unavailable dates and disable them in the date picker
        axios.post('/unavailable-dates', { placeId: accommodation._id}).then(({ data }) => {
            console.log(data);
            data.forEach(element => {
                excludedDatesArr.push({
                    //start: addDays(parseISO(element.checkInDate), -1),
                    //end: addDays(parseISO(element.checkOutDate), -1)
                    start: parseISO(element.checkInDate),
                    end: parseISO(element.checkOutDate)
                })
            });
            setUnavailableDates(excludedDatesArr);
        }).catch((err) => {
            console.log(err);
        });
        

    }, [])

    async function bookAccommodation() {
        let accessToken = localStorage.getItem('token');
        const headers = {
            'token': accessToken
        }

        const bookingPrice = differenceInCalendarDays(new Date(checkOutDate), new Date(checkInDate)) * accommodation.price;
        const bookingData = {
            placeId: accommodation._id,
            checkInDate, checkOutDate,
            price: bookingPrice,
            noGuests
        };

        try {
            const { data } = await axios.post('/bookings', bookingData, { headers: headers });
            toast.success('Successfully created booking!', {
                position: "bottom-center",
            });

            setRedirect(`/profile/bookings?success=true`);
        } catch (err) {
            console.log(err);
            alert(`Could not create booking! ${err.response.data.message}`);
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: <b>€{accommodation.price}</b> per night
            </div>
            <div className="border rounded-2xl mt-5">
                <div className="flex">
                    <div className="my-2 p-3 border-r">
                        <label>Check-In date: </label>
                        {/* <input type="date" value={checkInDate} onChange={ev => setCheckInDate(ev.target.value)} /> */}
                        <DatePicker
                            showIcon
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            minDate={new Date()}
                            excludeDateIntervals={unavailableDates}
                        />

                    </div>
                    <div className="my-2 p-3">
                        <label>Check-Out date: </label>
                        {/* <input type="date" value={checkOutDate} onChange={ev => setCheckOutDate(ev.target.value)} /> */}
                        <DatePicker
                            showIcon
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            minDate={new Date()}
                            excludeDateIntervals={unavailableDates}
                        />
                    </div>
                </div>
                <div className="my-2 p-3 border-t">
                    <label>No. of guests: </label>
                    <input type="number" value={noGuests} onChange={ev => setNoGuests(ev.target.value)} />
                </div>
            </div>

            <button onClick={bookAccommodation} className="primary mt-4 font-semibold">
                Book now!
                {checkInDate && checkOutDate && (
                    <span> €{differenceInCalendarDays(new Date(checkOutDate), new Date(checkInDate)) * accommodation.price} </span>
                )}
            </button>
            <ToastContainer closeOnClick autoClose={false} position="bottom-center" />
        </div>
    );
}