'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600">SchoolFinder</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Link href="/addSchool">
            <span className={`px-4 py-2 rounded-full transition-colors ${
              isActive('/addSchool')
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'hover:bg-gray-100'
            }`}>
              Add School
            </span>
          </Link>
          <Link href="/showSchools">
            <span className={`px-4 py-2 rounded-full transition-colors ${
              isActive('/showSchools')
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'hover:bg-gray-100'
            }`}>
              View Schools
            </span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/addSchool">
              <span className={`block px-4 py-2 rounded-full transition-colors ${
                isActive('/addSchool')
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'hover:bg-gray-100'
              }`} onClick={() => setIsOpen(false)}>
                Add School
              </span>
            </Link>
            <Link href="/showSchools">
              <span className={`block px-4 py-2 rounded-full transition-colors ${
                isActive('/showSchools')
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'hover:bg-gray-100'
              }`} onClick={() => setIsOpen(false)}>
                View Schools
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;