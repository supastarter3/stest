"use client"
import { createApiCaller } from "api/trpc/caller";

import { apiClient } from '@shared/lib/api-client';

export default async function Tenant() {
    // const apiCaller = await createApiCaller();
    // const orgDetails = await apiCaller.org.orgs();
    const { data: orgDetails } = apiClient.org.orgs.useQuery(undefined, {
        staleTime: Infinity

    });
    console.log(orgDetails);
    return (
        <div className="p-2">
            {/* <div className="flex items-center justify-center p-2">
                <Heading text="Tenant" size="medium" color="blue" />
            </div> */}
            {/* <div className="flex items-start justify-between">
                <SearchBar />
                <AddTenant />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {orgDetails.length > 0 && orgDetails.map((org) => (
                    <div id={org.org_name} key={org.org_id} >
                        <CardComponent org_id={org.org_id} org_name={org.org_name}
                            org_address={org.org_address}
                            org_contact_number={org.org_contact_number} status={org.status} />
                    </div>
                ))}
            </div> */}
            
        </div>
    );
}