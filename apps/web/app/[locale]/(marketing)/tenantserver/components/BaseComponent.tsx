"use client"

import { Button } from "@ui/components/button";
import SearchBar from "@ui/components/searchBar";
import { useEffect, useState } from "react";
import AddTenant from "./AddTenant";
import CardComponent from "./CardComponent";

export default function BaseComponent({ orgDetails }) {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [orgs, setOrgs] = useState(orgDetails);
    const [search, setSearch] = useState('');

    const pageCount = Math.ceil(orgs.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orgs.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        if (search) {
            const filteredOrgs = orgDetails.filter(org => org.org_name.toLowerCase().includes(search.toLowerCase()));
            setOrgs(filteredOrgs);
        } else {
            setOrgs(orgDetails);
        }
    }, [search])


    return (
        <>
            <div className="flex items-start justify-between">
                <SearchBar search={search} setSearch={setSearch} />
                <AddTenant setOrgs={setOrgs} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentItems.map((org) => (
                    <div id={org.org_name} key={org.org_id}>
                        <CardComponent
                            org_id={org.org_id}
                            org_name={org.org_name}
                            org_address={org.org_address}
                            org_contact_number={org.org_contact_number}
                            status={org.status}
                        />
                    </div>
                ))}
            </div>
            <div className="flex mt-2 items-center bottom-10 fixed right-0 mx-2">   
            <span onClick={() => {if (currentPage > 1) {paginate(currentPage - 1);}}}
                style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed', opacity: currentPage > 1 ? 1 : 0.5 }}>
                    <svg className="h-6 w-6 stroke-current" width="800px" height="800px" viewBox="0 0 24 24" id="triple-left-sign" data-name="Line Color" xmlns="http://www.w3.org/2000/svg">
                        <polyline id="secondary" points="15.5 5 8.5 12 15.5 19" style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }}></polyline>
                        <polyline id="primary" points="10 19 3 12 10 5" style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }}></polyline>
                        <polyline id="primary-2" data-name="primary" points="21 5 14 12 21 19" style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }}></polyline>
                    </svg>
            </span>
                <span className="mx-2">{currentPage}</span>
                <span onClick={() => { if (currentPage < pageCount) { paginate(currentPage + 1);}}}
                style={{ cursor: currentPage < pageCount ? 'pointer' : 'not-allowed', opacity: currentPage < pageCount ? 1 : 0.5 }}>
                <svg className="h-6 w-6 stroke-current" width="800px" height="800px" viewBox="0 0 24 24" id="triple-right-sign" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg">
                    <polyline id="primary" points="8.5 19 15.5 12 8.5 5" style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }}></polyline>
                    <polyline id="primary-2" data-name="primary" points="14 5 21 12 14 19" style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }}></polyline>
                    <polyline id="primary-3" data-name="primary" points="3 19 10 12 3 5" style={{ fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }}></polyline>
                </svg>
                </span>
 
            </div>
        </>
    );
}