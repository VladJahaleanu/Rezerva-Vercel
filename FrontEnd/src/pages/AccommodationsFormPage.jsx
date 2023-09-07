import { useState } from "react";
import Perks from "../Perks";
import ProfileNav from "../ProfileNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Select from "react-select";
import Image from "../Image";

export default function AccommodationsFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);

    const selectOptions = [
        { value: 'beach', label: 'Close to the beach' },
        { value: 'mountain', label: 'Close to the mountains' },
        { value: 'cityBreak', label: 'City Break' },
        { value: 'other', label: 'Other' }
    ];

    useEffect(() => {
        if (!id) {
            return;
        }

        axios.get('/accommodations/' + id).then(({ data }) => {
            //add info to page
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
            setSelectedValue(data.category);

        })
    }, [id])

    //upload photo by link functionality
    async function addPhotoUsingLink(ev) {
        ev.preventDefault();
        const { data: filename } = await axios.post('/upload-using-link', { link: photoLink });
        setAddedPhotos(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    }

    //upload photo from device functionality
    async function uploadPhoto(ev) {
        const files = ev.target.files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }
        const { data: filenames } = await axios.post('/upload-photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAddedPhotos(prev => {
            return [...prev, ...filenames];
        });
    }

    async function saveAccommodation(ev) {
        ev.preventDefault();
        let accessToken = localStorage.getItem('token');
        const headers = {
            'token': accessToken
        }

        const placeToSave = {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests, price,
            category: selectedValue.value
        };

        //check for id param, if we have it -> update existing
        //                          don't have it -> create new
        if (id) {
            //update
            try {
                const { data } = await axios.put('/accommodations/' + id, placeToSave, { headers: headers });
                setRedirect(true);
            } catch (err) {
                alert(`Could not edit place! ${err}`);
            }

        } else {
            //create
            try {
                const { data } = await axios.post('/accommodations', placeToSave, { headers: headers });
                setRedirect(true);
            } catch (err) {
                alert(`Could not add place! ${err}`);
            }
        }


    }

    function deletePhoto(photoName) {
        setAddedPhotos(addedPhotos.filter(pic => pic !== photoName));
    }

    function makePrimaryPhoto(ev, photoName) {
        ev.preventDefault();
        setAddedPhotos([photoName, ...addedPhotos.filter(pic => pic !== photoName)]);
    }

    if (redirect) {
        return <Navigate to={'/profile/accommodations'} />
    }

    return (
        <div>
            <ProfileNav />
            <form onSubmit={saveAccommodation}>
                <h2 className="text-xl mt-5">Title</h2>
                <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder='Place title, e.g: Relaxing place near the forest' />
                <h2 className="text-xl mt-5">Address</h2>
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder='Address' />
                <h2 className="text-xl mt-5">Photos</h2>
                <p className="text-gray-500 text-sm">The more, the better!</p>
                <div className="flex gap-2">
                    <input type="text" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder={'Add photos by link.'} />
                    <button onClick={addPhotoUsingLink} className="bg-primary px-6 rounded-full text-white">Add&nbsp;photo</button>
                </div>
                <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {addedPhotos.length > 0 && addedPhotos.map(imgLink => (
                        <div key={imgLink} className="h-32 flex relative">
                            <Image className="rounded-2xl w-full object-cover" src={imgLink} />
                            <button onClick={() => deletePhoto(imgLink)} className="absolute cursor-pointer right-2 text-white p-2 bg-gray-500 bg-opacity-70 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                            </button>
                            <button onClick={ev => makePrimaryPhoto(ev, imgLink)} className="absolute cursor-pointer left-2 text-white p-2 bg-gray-500 bg-opacity-70 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <label className="h-32 flex cursor-pointer items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl">
                        <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Upload
                    </label>
                </div>
                <h2 className="text-xl mt-5">Description</h2>
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                <h2 className="text-xl mt-5">Perks</h2>
                <p className="text-gray-500 text-sm">Select all that apply!</p>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                <h2 className="text-xl mt-5">Miscellaneous</h2>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check In time</h3>
                        <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder='13' />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check Out time</h3>
                        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder='11' />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)} placeholder='8' />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price}
                            onChange={ev => setPrice(ev.target.value)} />
                    </div>
                </div>

                <h2 className="text-xl mt-5 mb-2">Category</h2>
                <Select className=""
                    options={selectOptions}
                    placeholder='Select a category from the dropdown!'
                    defaultValue={selectedValue}
                    onChange={setSelectedValue}
                />

                <h2 className="text-xl mt-5">Extra Info</h2>
                <p className="text-gray-500 text-sm">House rules, good to know, etc.</p>
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

                <button className="primary my-5">Save place!</button>

            </form>
        </div>
    )
}