'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import PlaceholderImage from '@/components/PlaceholderImage';
import SkeletonCard from '@/utils/skeleton';
import { showToast } from '@/utils/toast';

const ShowSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  useEffect(() => {
    fetchSchools();
  }, [pagination.page, searchTerm, selectedCity, selectedState]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCity) params.append('city', selectedCity);
      if (selectedState) params.append('state', selectedState);

      const response = await fetch(`/api/schools/get?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSchools(data.schools);
        setPagination(data.pagination);
        
        // Extract unique cities and states from all schools
        const allSchoolsResponse = await fetch('/api/schools/get');
        if (allSchoolsResponse.ok) {
          const allData = await allSchoolsResponse.json();
          const uniqueCities = [...new Set(allData.schools.map(school => school.city).filter(Boolean))];
          const uniqueStates = [...new Set(allData.schools.map(school => school.state).filter(Boolean))];
          setCities(uniqueCities);
          setStates(uniqueStates);
        }
      } else {
        showToast.error('Failed to fetch schools');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      showToast.error('An error occurred while fetching schools');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Function to check if a school has a valid image
  const hasValidImage = (school) => {
    return school.image && 
           school.image.trim() !== '' &&
           school.image !== null;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { totalPages, page } = pagination;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Directory</h1>
          <p className="text-lg text-gray-600">Browse and find schools in your area</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search schools by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 focus:outline-none transition"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 focus:outline-none transition"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-500 focus:outline-none transition"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(pagination.limit)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : schools.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCity || selectedState
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding a new school to the directory'}
            </p>
            <Link href="/addSchool">
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                Add New School
              </span>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span> to <span className="font-semibold">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of <span className="font-semibold">{pagination.total}</span> schools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {schools.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => {
                    showToast.info('School details page coming soon!');
                  }}
                >
                  <div className="h-48 overflow-hidden bg-gray-200 relative">
                    {hasValidImage(school) ? (
                      <Image
                        src={school.image}
                        alt={school.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          // If image fails to load, hide it and show placeholder
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <PlaceholderImage />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{school.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 truncate">{school.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {school.city}, {school.state}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {school.contact}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`px-3 py-2 rounded-md ${
                      pagination.page === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
                      disabled={pageNum === '...'}
                      className={`px-3 py-2 rounded-md ${
                        pageNum === pagination.page
                          ? 'bg-teal-500 text-white'
                          : pageNum === '...'
                          ? 'text-gray-700 cursor-default'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`px-3 py-2 rounded-md ${
                      pagination.page === pagination.totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowSchools;