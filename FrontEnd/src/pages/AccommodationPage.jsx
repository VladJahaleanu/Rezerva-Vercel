import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingTab from "../BookingTab";
import Image from "../Image";

export default function AccommodationPage() {
    const { id } = useParams();
    const [accommodation, setAccommodation] = useState(null);
    const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }

        axios.get('/accommodations/' + id).then(({ data }) => {
            setAccommodation(data);
        })

    }, [id]);

    if (!accommodation) return '';

    if (showPhotoAlbum) {
        return (
            <div className="absolute bg-white min-w-full min-h-screen">
                <div className="p-10 grid gap-5">
                    <div className="">
                        <h2 className="text-2xl font-bold"> Photos of {accommodation.title} in {accommodation.address}</h2>
                        <button onClick={() => setShowPhotoAlbum(false)} className="flex gap-1 py-3 px-4 rounded-xl shadow shadow-gray-500 fixed border border-black bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Close album
                        </button>
                    </div>
                    {accommodation?.photos?.length > 0 && accommodation.photos.map(pic => (
                        <div>
                            <Image className="rounded-2xl" src={pic} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mt-10 bg-gray-100 -mx-8 px-8 pt-8">
            <h1 className="text-3xl">
                {accommodation.title}
            </h1>

            <a className="flex gap-1 font-semibold underline mt-1" target="_blank" href={'https://maps.google.com/?q=' + accommodation.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {accommodation.address}
            </a>
            <div className="relative mt-3">
                <div className="grid gap-2 grid-cols-[2fr_1fr_1fr] rounded-2xl overflow-hidden">
                    <div>
                        {accommodation.photos?.[0] && (
                            <div>
                                <Image onClick={() => setShowPhotoAlbum(true)} className="cursor-pointer aspect-square object-cover h-full w-full" src={accommodation.photos[0]} />
                            </div>

                        )}
                    </div>
                    <div className="grid">
                        {accommodation.photos?.[1] && (
                            <Image onClick={() => setShowPhotoAlbum(true)} className="cursor-pointer aspect-square object-cover" src={accommodation.photos[1]} />
                        )}
                        <div className="overflow-hidden">
                            {accommodation.photos?.[2] && (
                                <Image onClick={() => setShowPhotoAlbum(true)} className="cursor-pointer aspect-square object-cover relative top-2" src={accommodation.photos[2]} />
                            )}
                        </div>
                    </div>
                    <div className="grid">
                        {accommodation.photos?.[3] && (
                            <Image onClick={() => setShowPhotoAlbum(true)} className="cursor-pointer aspect-square object-cover" src={accommodation.photos[3]} />
                        )}
                        <div className="overflow-hidden">
                            {accommodation.photos?.[4] && (
                                <Image onClick={() => setShowPhotoAlbum(true)} className="cursor-pointer aspect-square object-cover relative top-2" src={accommodation.photos[4]} />
                            )}
                        </div>
                    </div>
                </div>
                {accommodation.photos.length > 4 && (
                    <button onClick={() => setShowPhotoAlbum(true)} className="absolute flex bottom-2 right-2 py-2 px-4 bg-white rounded-xl border border-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                        Show all photos
                    </button>
                )}
            </div>

            <div className="grid mt-6 gap-10 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div className="">
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {accommodation.description}
                    </div>
                    <b>Check-In: </b> {accommodation.checkIn} <br />
                    <b>Check-Out: </b> {accommodation.checkOut} <br />
                    <b>Maximum number of guests: </b> {accommodation.maxGuests}
                    {accommodation.extraInfo && (
                        <div>
                            <h3 className="mt-3 font-semibold">Extra Info</h3>
                            <div className="">
                                {accommodation.extraInfo}
                            </div>
                        </div>
                    )}


                </div>
                <div>
                    <BookingTab accommodation={accommodation} />
                </div>
            </div>
        </div>
    );
}