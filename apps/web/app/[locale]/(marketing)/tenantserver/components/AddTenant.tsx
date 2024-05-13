"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { errorMessages } from '@marketing/shared/components/ErrorMessages';
import GenericForm from '@marketing/shared/components/GenericForm';
import { apiClient } from '@shared/lib/api-client';
import { Button } from '@ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger
} from '@ui/components/dialog';
import { Icon } from '@ui/components/icon';
import { useToast } from "@ui/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';


const formSchema = z.object({
    org_name: z.string().nonempty("Name should not be empty").regex(/^(?!.*\s{2,})(?=[a-zA-Z\s]+$).*\S.*$/, "Name cannot have special charactes or numbers or empty spaces"),
    org_address: z.string().nonempty("Address should not be empty"),
    org_contact_number: z.string()
        .min(10, 'Contact number should be at least 10 characters')
        .max(15, 'Contact number should not exceed 15 characters')
        .regex(/^\+?\d+(-\d+)*$/, 'Contact number must only contain numerics, +, and -'),
});

type FormValues = z.infer<typeof formSchema>;

function AddTenant({ setOrgs }) {
    const router = useRouter();
    const { toast } = useToast();
    const createNewOrgs = apiClient.org.createOrgs.useMutation();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            org_address: '',
            org_name: '',
            org_contact_number: ''
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        try {
            await createNewOrgs.mutateAsync({
                ...values,
            });
            form.reset({
                org_address: '',
                org_name: '',
                org_contact_number: ''
            });
            toast({
                title: "Created",
                description: `${values.org_name} is successFully Created`,
                variant: "success",
            });
            window.location.reload();
        } catch (error: any) {
            const errorMessage = error.message;
            const normalizedErrorMessage = (errorMessage.replace(/^\s*[\r\n]/gm, '').split(":")[1]?.concat(errorMessage.replace(/^\s*[\r\n]/gm, '')?.split(":")[2]))?.trim();
            let customErrorMessage = errorMessages[normalizedErrorMessage];
            if (!customErrorMessage) {
                customErrorMessage = error.message
            }
            toast({
                title: "Error",
                description: `${customErrorMessage}`,
                variant: "error",
            });
        }
    };

    const propArray: any = [
        { name: "Name", type: "text", id: "org_name", placeholder: "Enter Name" },
        { name: "Address", type: "textarea", id: "org_address", placeholder: "Enter Address" },
        { name: "Contact Number", type: "text", id: "org_contact_number", placeholder: "Enter Contact Number" }
    ]

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Icon.plus className="w-4 h-4" /> Add
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <h2>Add Tenant</h2>
                    </DialogHeader>
                    <DialogDescription asChild>
                        <div>
                            <GenericForm propArray={propArray} form={form} onSubmit={onSubmit} showFooter={true} popUp="true" editable="true" showReset={true} />
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddTenant
