"use client"

import { apiClient } from "@shared/lib/api-client";

export const addTenant = async (data) => {
    console.log("IN FUNC", data);
    const newOrg = await apiClient.org.createOrgs.useMutation()
    try {
        await newOrg.mutateAsync(data)
    } catch (e) {
        console.log("add org error", e)
    }
}