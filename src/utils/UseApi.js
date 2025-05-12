// import { useState, useEffect, useCallback } from 'react';

import { useEffect, useState } from "react";

// const useApi = (url, options = {}) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       setData(result);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [url, JSON.stringify(options)]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch: fetchData };
// };

// Usage with your URL:
// const { data: companies } = useApi(
//   "http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api/company/"
// );

const useApi = (apiCallFunction, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiCallFunction();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [apiCallFunction]);

  return { data, isLoading, error };
};
export default useApi;
