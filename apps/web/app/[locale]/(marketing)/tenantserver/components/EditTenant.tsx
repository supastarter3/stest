"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import GenericForm from '@marketing/shared/components/GenericForm';
import { apiClient } from '@shared/lib/api-client';
import IconWrapper from '@ui/components/IconWrapper';
import { Button } from '@ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger
} from '@ui/components/dialog';
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
const formSchema = z.object({
    org_name: z.string().nonempty("Name should not be empty").regex(/^(?!.*\s{2,})(?=[a-zA-Z\s]+$).*\S.*$/," Name cannot have special charactes or numbers or empty spaces"),
    org_address: z.string().nonempty("Address should not be empty").regex(/^[^\!\@\#\$\%\^\&\*\_]+$/, "Address cannot contain special characters "),
    org_contact_number: z.string()
        .min(10, 'Contact number should be at least 10 characters')
        .max(15, 'Contact number should not exceed 15 characters')
        .regex(/^\+?\d+(-\d+)*$/, 'Contact number must only contain numerics, +, and -'),
    status: z.string()
});

type FormValues = z.infer<typeof formSchema>;


export default function EditTenant({ org_id, org_name, org_address, org_contact_number, status }) {
    const t = useTranslations();
    const router = useRouter();
    const { toast } = useToast();
    const [edit, setEdit] = useState(true);
    const updateOrg = apiClient.org.updateOrgs.useMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            org_address,
            org_name,
            org_contact_number,
            status
        },
    });


    const propArray: any = [
        { name: "Name", type: "text", id: "org_name", placeholder: "Enter Name" },
        { name: "Address", type: "textarea", id: "org_address", placeholder: "Enter Address" },
        { name: "Contact Number", type: "text", id: "org_contact_number", placeholder: "Enter Contact Number" },
        { name: "Status", type: "select", id: "status", values: ['true', 'false'] }
    ]


    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            await updateOrg.mutateAsync({
                ...values,
                org_id
            });
            window.location.reload();
            // form.reset();
            toast({
                title: "Updated",
                description: `${values.org_name} is successFully Updated`,
                variant: "success",
            });
        } catch (error: any) {
            let errMsg = error.message;
            toast({
                title: "Error",
                description: `${errMsg}`,
                variant: "error",
            });
        }
    };


    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"secondary"}>
                        View more
                        <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <h2 className='truncate'>Edit Tenant</h2>
                            <IconWrapper className="cursor-pointer" onClick={() => setEdit(!edit)}>
                                {!edit ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>}

                            </IconWrapper>
                        </div>
                    </DialogHeader>
                    <DialogDescription asChild>
                        <div>
                            <GenericForm propArray={propArray} form={form} onSubmit={onSubmit} showFooter={!edit} popUp="true" editable={!edit} showReset={!edit} />
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}
