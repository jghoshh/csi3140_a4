import { RiHome2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

import './component_styles.css';
import { Button } from "./Button";

export function UserNavbar() {
    const navigate = useNavigate();
    return (
        <div className='header'>
            <Button text='Home' buttonIcon='home' backgroundColor='#204877' textColor='white' action={() => navigate("/")} />
        </div>
    )
}