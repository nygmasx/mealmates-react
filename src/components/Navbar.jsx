import React from 'react';
import {FaRegUser} from 'react-icons/fa';
import {Link, useLocation} from 'react-router';
import {CiMap} from "react-icons/ci";
import {RiMenuSearchLine} from "react-icons/ri";
import {IoCartOutline} from "react-icons/io5";
import {MdFavoriteBorder} from "react-icons/md";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="w-full h-24 bg-white border-t border-gray-200 shadow-sm">
            <div className="h-full grid grid-cols-5 max-w-screen-xl mx-auto">
                <Link
                    to="/map"
                    className={`flex flex-col items-center justify-center ${isActive('/map') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <CiMap className="text-3xl mb-1"/>
                    <span className="text-xs">Explorer</span>
                </Link>

                <Link
                    to="/search"
                    className={`flex flex-col items-center justify-center ${isActive('/search') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <RiMenuSearchLine className="text-3xl mb-1"/>
                    <span className="text-xs">Rechercher</span>
                </Link>

                <Link
                    to="/cart"
                    className={`flex flex-col items-center justify-center ${isActive('/cart') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <IoCartOutline className="text-3xl mb-1"/>
                    <span className="text-xs">Panier</span>
                </Link>

                <Link
                    to="/favorites"
                    className={`flex flex-col items-center justify-center ${isActive('/favorites') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <MdFavoriteBorder className="text-3xl mb-1"/>
                    <span className="text-xs">Favoris</span>
                </Link>

                <Link
                    to="/profile"
                    className={`flex flex-col items-center justify-center ${isActive('/dashboard') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <FaRegUser className="text-3xl mb-1"/>
                    <span className="text-xs">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
