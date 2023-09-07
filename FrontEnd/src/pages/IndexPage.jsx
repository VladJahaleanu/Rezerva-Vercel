import { Link } from "react-router-dom";
import Header from "../Header";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Select from "react-select";
import Image from "../Image";



export default function IndexPage() {
    const [accommodations, setAccommodations] = useState([]);
    const [searchedAccommodations, setSearchedAccommodations] = useState([]);
    const [searchParams, setSearchParams] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);

    const selectOptions = [
        { value: 'beach', label: 'Close to the beach' },
        { value: 'mountain', label: 'Close to the mountains' },
        { value: 'cityBreak', label: 'City Break' },
        { value: 'other', label: 'Other' },
        { value: 'all', label: 'Show all accommodations' }
    ];

    useEffect(() => {
        if (!selectedValue || selectedValue.value === 'all') {
            axios.get('/accommodations').then(({ data }) => {
                setAccommodations(data);
            });
        } else {
            const params = new URLSearchParams([['category', selectedValue.value]]);
            axios.get('/accommodations', { params }).then(({ data }) => {
                setAccommodations(data);
            })
        }

    }, [selectedValue]);

    //search function
    async function getSearchedAccommodations(value) {

        var filteredResults = accommodations.filter((currPlace) => {
            return currPlace && (currPlace.title.toLowerCase().includes(value.toLowerCase()) || currPlace.address.toLowerCase().includes(value.toLowerCase()));
        })

        //if a value is selected from the dropdown, search only in that category, else fetch all places
        if (!value) {
            if (!selectedValue || selectedValue.value === 'all') {
                const { data } = await axios.get('/accommodations');
                filteredResults = data.filter((currPlace) => {
                    return currPlace && (currPlace.title.toLowerCase().includes(value.toLowerCase()) || currPlace.address.toLowerCase().includes(value.toLowerCase()));
                })
            } else {
                const params = new URLSearchParams([['category', selectedValue.value]]);
                const { data } = await axios.get('/accommodations', { params });
                filteredResults = data.filter((currPlace) => {
                    return currPlace && (currPlace.title.toLowerCase().includes(value.toLowerCase()) || currPlace.address.toLowerCase().includes(value.toLowerCase()));
                })
            }

        }

        setAccommodations(filteredResults);
    }

    async function handleChange(value) {
        setSearchParams(value);
        getSearchedAccommodations(value);
    }

    async function handleChangeSelect(value) {
        setSelectedValue(value);
        console.log(accommodations);
        console.log(selectedValue);
        //getRecommendedAccommodations(value);
    }

    return (
        <div>
            <div className="flex justify-center items-center">
                <input className="flex gap-2 border border-gray-300 rounded py-2 px-5 shadow-md shadow-gray-250 searchBar "
                    placeholder="Search for a location/place name..."
                    value={searchParams}
                    onChange={ev => handleChange(ev.target.value)}
                />
                <button className="bg-primary text-white p-1 rounded-full ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            </div>
            <div className="flex justify-center items-center mt-5">
                <Select className="select mr-9 shadow-md shadow-gray-250 rounded-full"
                    options={selectOptions}
                    placeholder='Unsure? Choose an item to see our recommendations!'
                    defaultValue={selectedValue}
                    onChange={setSelectedValue}
                />
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
                {accommodations.length > 0 && accommodations.map(acc => (
                    <Link to={'/accommodation/' + acc._id} key={acc._id}>
                        <div className="bg-gray-500 rounded-2xl mb-3">
                            {acc.photos?.[0] && (
                                <Image className="rounded-2xl object-cover aspect-square" src={acc.photos?.[0]} />
                            )}
                        </div>
                        <h2 className="font-bold leading-4">{acc.address}</h2>
                        <h3 className="truncate leading-5">{acc.title}</h3>
                        <div className="mt-1">
                            <span className="font-bold">€{acc.price} </span>
                            per night
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    );
}