import React from 'react';
import {FaRegUser} from 'react-icons/fa';
import {Link, useLocation} from 'react-router';
import {IoMapOutline} from "react-icons/io5";
import {RiMenuSearchLine} from "react-icons/ri";
import {MdOutlineMessage} from "react-icons/md";
import {CgAddR} from "react-icons/cg";

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="w-full h-24 bg-white border-t border-gray-200 shadow-sm fixed bottom-0 z-[900]">
            <div className="h-full grid grid-cols-5 max-w-screen-xl mx-auto">
                <Link
                    to="/map"
                    className={`flex flex-col items-center justify-center ${isActive('/map') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <IoMapOutline className="text-3xl mb-1"/>
                    <span className="text-xs">Explorer</span>
                </Link>

                <Link
                    to="/offers"
                    className={`flex flex-col items-center justify-center ${isActive('/offers') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <RiMenuSearchLine className="text-3xl mb-1"/>
                    <span className="text-xs">Rechercher</span>
                </Link>

                <Link
                    to="/offers/create"
                    className={`flex flex-col items-center justify-center ${isActive('/offers/create') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <CgAddR className="text-3xl mb-1"/>
                    <span className="text-xs">Publier</span>
                </Link>

                <Link
                    to="/messages"
                    className={`flex flex-col items-center justify-center ${isActive('/messages') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <MdOutlineMessage className="text-3xl mb-1"/>
                    <span className="text-xs">Messages</span>
                </Link>

                <Link
                    to="/profile"
                    className={`flex flex-col items-center justify-center ${isActive('/profile') ? 'text-green-600' : 'text-gray-600'}`}
                >
                    <FaRegUser className="text-3xl mb-1"/>
                    <span className="text-xs">Profil</span>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
