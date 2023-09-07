import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage";
import AccommodationsPage from "./pages/AccommodationsPage";
import AccommodationsFormPage from "./pages/AccommodationsFormPage";
import AccommodationPage from "./pages/AccommodationPage";
import BookingsPage from "./pages/BookingsPage";
import SingleBookingPage from "./pages/SingleBookingPage";

axios.defaults.baseURL= import.meta.env.VITE_API_BASE_URL;

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element= {<Layout />}>
        <Route index element= {<IndexPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/profile/' element={<ProfilePage />}/>
        <Route path='/profile/bookings' element={<BookingsPage />} />
        <Route path='/profile/bookings/:id' element={<SingleBookingPage />} />
        <Route path='/profile/accommodations' element={<AccommodationsPage />} />
        <Route path='/profile/accommodations/add' element={<AccommodationsFormPage />} />
        <Route path='/profile/accommodations/:id' element={<AccommodationsFormPage />} />
        <Route path='/accommodation/:id' element={<AccommodationPage/>} />
      </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
