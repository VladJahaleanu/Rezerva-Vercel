import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from 'react-cookie'
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [cookies, setCookie] = useCookies(['token'])
    const { setUser } = useContext(UserContext)
    async function loginUser(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', {
                userName,
                password
            });
            console.log(response);

            //set token in local storage
            localStorage.setItem('token', response.data.token);

            const headers = {
                'token': response.data.token
            }

            axios.get('/profile', { headers: headers }).then(({ data }) => {
                setUser(data);
            });

            setRedirect(true);
        } catch (err) {
            console.log(err)
            alert(`Login unsuccessful! ${err.response.data}`);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-5">
            <h1 className="text-4xl text-center py-5">Login</h1>
            <form className="max-w-2xl mx-auto flex flex-col" onSubmit={loginUser}>
                <input type='text' placeholder='Username' value={userName} onChange={ev => setUserName(ev.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                <button className="login loginBtn">Login</button>
                <div className="text-center py-2">
                    Looking for a vacation? <Link className="underline font-bold" to={'/register'}>Create an account for free!</Link>
                </div>
            </form>
        </div>
    );
}