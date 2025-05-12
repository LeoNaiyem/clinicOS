// fetch company data
const fetchCompanies= async()=>{
    const response = await fetch("/api/company");
    if(!response.ok) throw new Error('Failed to fetch companies');
    return response.json();   
}
//end of fetch company data

const fetchWareHouses = async ()=>{
    const res = await fetch("/api/warehouse");
    if(!res.ok) throw new Error('Failed to fetch warehouses');
    return res.json();
}

const fetchSuppliers= async()=>{
    const res= await fetch('/api/supplier');
    if(!res.ok) throw new Error('Failed to fetch suppliers');
    return res.json();
}

const fetchProducts= async()=>{
    const res = await fetch('/api/product')
    if(!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export { fetchCompanies, fetchProducts, fetchSuppliers, fetchWareHouses };

