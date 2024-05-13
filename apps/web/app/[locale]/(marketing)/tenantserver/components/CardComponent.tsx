"use client"

import IconWrapper from "@ui/components/IconWrapper"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/components/card"
import { useState } from "react"
import DeleteTenant from "./DeleteTenant"
import EditTenant from "./EditTenant"

export default function CardComponent({ org_id, org_name, org_address, org_contact_number, status }) {

    const [checkedValue, setCheckedValue] = useState(false);
    return (
        <Card
            key={org_name}
            className={`shadow-sm border-2 ${status === 'false' ? 'opacity-50' : ''}`}
        >
            <CardHeader className="border-b overflow-y-auto scroll-bar-class h-24">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{org_name}</CardTitle>
                    </div>
                    <IconWrapper>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                        </svg>
                    </IconWrapper>
                </div>
            </CardHeader>
            <CardContent className="py-4 h-24 overflow-y-auto scroll-bar-class">
                <p>{org_address}</p>
                <p>{org_contact_number}</p>
            </CardContent>
            <CardFooter className="flex justify-between h-12">
                <EditTenant key={org_id} org_id={org_id} org_name={org_name} org_address={org_address}
                    org_contact_number={org_contact_number} status={status}
                />
                <DeleteTenant org_id={org_id} org_name={org_name} setCheckedValue={setCheckedValue} />
            </CardFooter>
        </Card>
    )
}
