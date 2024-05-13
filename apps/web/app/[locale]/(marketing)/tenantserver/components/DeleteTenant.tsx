"use client"
import DeleteComponent from '@marketing/shared/components/DeleteComponent';
import { apiClient } from '@shared/lib/api-client';
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';
export default function DeleteTenant({ org_id, org_name, setCheckedValue }: { org_id: number, org_name: string, setCheckedValue: Function }) {
    const t = useTranslations();
    const router = useRouter();
    const { toast } = useToast();
    const deleteOrg = apiClient.org.deleteOrgs.useMutation();

    const deleteTenant = async () => {
        try {
            await deleteOrg.mutateAsync({ org_id });
            toast({
                title: "Deleted",
                description: `${org_name} is successFully Deleted`,
                variant: "success",
            });
        } catch {
            toast({
                title: "Error",
                description: `${org_name} is not Deleted`,
                variant: "error",
            });
        } finally {
            window.location.reload();
        }
    }

    return (
        <DeleteComponent name="Tenant" onSubmit={deleteTenant} />
    )
}
