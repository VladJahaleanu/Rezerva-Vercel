import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import { data } from "autoprefixer";
import ProfileNav from "../ProfileNav";
import { useEffect } from "react";
import Image from "../Image";

export default function AccommodationsPage() {
    const [accommodations, setAccommodations] = useState([]);
    useEffect(() => {
        let accessToken = localStorage.getItem('token');
        const headers = {
            'token': accessToken
        }
        axios.get('/user-accommodations', { headers: headers }).then(({ data }) => {
            setAccommodations(data);
        });
    }, []);

    return (
        <div>
            <ProfileNav />
            <div className="text-center">
                <Link className='inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full' to={'/profile/accommodations/add'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add a place
                </Link>
            </div>
            <div className="mt-5">
                {accommodations.length > 0 && accommodations.map(accommodation => (
                    <Link to={'/profile/accommodations/' + accommodation._id} className="flex cursor-pointer gap-5 bg-gray-200 p-5 rounded-2xl mb-5">
                        <div className="w-32 h-32 rounded-2xl bg-gray-300 shrink-0">
                            {accommodation.photos.length > 0 && (
                                <Image className="rounded-2xl w-full h-full object-cover" src={accommodation.photos[0]} alt="" />
                            )}
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl font-bold">{accommodation.title}</h2>
                            <p className="text-sm mt-2">{accommodation.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}