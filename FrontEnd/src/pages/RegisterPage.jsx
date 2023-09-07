import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function registerUser(ev) {
        ev.preventDefault();
        await axios.post('/register', {
            firstName,
            lastName,
            userName,
            email,
            password
        }).then((res) => {
            alert('Registration successful! You can now log in!')
            setRedirect(true);
        }).catch((err) => {
            console.log(err)
            //alert(`Registration failed! ${err.response.data}`)
        });
    }

    if (redirect) {
        return <Navigate to={'/login'} />
    }

    return (
        <div className="mt-5">
            <h1 className="text-4xl text-center py-5">Register</h1>
            <form className="max-w-2xl mx-auto flex flex-col" onSubmit={registerUser}>
                <input type="text" placeholder="First Name" value={firstName} onChange={ev => setFirstName(ev.target.value)} />
                <input type="text" placeholder="Last Name" value={lastName} onChange={ev => setLastName(ev.target.value)} />
                <input type="text" placeholder="Username" value={userName} onChange={ev => setUserName(ev.target.value)}/>
                <input type='email' placeholder='your@email.com' value={email} onChange={ev => setEmail(ev.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)}/>
                <button className="login loginBtn">Register</button>
                <div className="text-center py-2">
                    Already have an account? <Link className="underline font-bold" to={'/login'}>Login now!</Link>
                </div>
            </form>
        </div>
    );
}