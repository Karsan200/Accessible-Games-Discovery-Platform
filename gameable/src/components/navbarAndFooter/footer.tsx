import './footer.css'
import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <ul>
                    <li><NavLink to="/footerPages/aboutUs">About Us</NavLink></li>
                    <li><NavLink to="/footerPages/accessibilityStatement">Accessibility Statement</NavLink></li>
                    <li><NavLink to="/footerPages/contactUs">Contact Us</NavLink></li>
                </ul>
            </div>
            <div className="footer-bottom">
                {/* HTML symbols learning resource - https://www.w3schools.com/html/html_symbols.asp*/}
                <p className="footer-copyright">&copy; 2025 All rights reserved</p>
                <p className="footer-company">Game Able</p>
            </div>
        </footer>
    )}