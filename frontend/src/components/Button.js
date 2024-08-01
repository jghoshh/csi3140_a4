import { RiHome2Line } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";

import './component_styles.css';

// Default template for buttons (Icon + Text)
export function Button({ text, buttonIcon, backgroundColor, textColor, action }) {
    return (
        <div
            style={{
                height: '30px',
                alignItems: 'center',
                display: 'flex',
                background: backgroundColor,
                padding: '10px',
                borderRadius: '20px',
                color: textColor,
                cursor: 'pointer',
                marginRight: '20px',
            }}
            onClick={action}
        >
            {buttonIcon == 'home' ?
                <RiHome2Line size={22} style={{ marginRight: '10px' }} />
                : buttonIcon == 'add' ? <IoAddCircleOutline size={22} style={{ marginRight: '10px' }} /> : null}
            <b>{text}</b>
        </div>
    );
}