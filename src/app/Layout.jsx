import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="h-dvh">
      <div className="h-[89%]">
        {children}
      </div>
      <Navbar className="h-[11%]" />
    </div>
  );
};

export default Layout;
