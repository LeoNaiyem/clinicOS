// src/hooks/useApi.js
import { useEffect, useState } from "react";

const useApi = (apiCall, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;


// <-------------------------using in a component----------------------------------------->


// 1.First, you'd create an API call function:


// const fetchCompanies = async () => {
//   const response = await fetch(
//     "http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/company/"
//   );
//   if (!response.ok) throw new Error('Failed to fetch companies');
//   return response.json();
// };

// // src/components/CompanyList.jsx
// import React from 'react';
// import useApi from '../hooks/useApi';
// import { fetchCompanies } from '../services/api';

// const CompanyList = () => {
//   const { data: companies, loading, error } = useApi(fetchCompanies);

//   if (loading) return <div className="loading-spinner">Loading...</div>;
//   if (error) return <div className="error-alert">Error: {error.message}</div>;

//   return (
//     <div className="company-list">
//       <h2>Companies</h2>
//       <ul>
//         {companies.map(company => (
//           <li key={company.id}>
//             <h3>{company.name}</h3>
//             <p>{company.email}</p>
//             <p>{company.street_address}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CompanyList;