import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { categoryFormSchema, accountFormSchema } from "@/lib/zod/zodSchemas";
import { handleResponse, handleCatchError } from "@/lib/transactionUtils/transactionFunctions";

interface EntityFormDialogProps {
    currentType: string;
    handleDeleteCategory: (categoryId: string) => Promise<void>;
    handleDeleteAccount: (accountId: string) => Promise<void>;
}

const EntityFormDialog: React.FC<EntityFormDialogProps> = ({
    currentType,
    handleDeleteCategory,
    handleDeleteAccount,
}) => {
    const { setIsAddEntityOpen, isAddEntityOpen, entityType, categories, accounts, handleEntity, setHandleEntity } = useStore();
    const router = useRouter();
    const formSchema = entityType === "category" ? categoryFormSchema : accountFormSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: handleEntity?.name || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (entityType === "category") {
            await handleAddCategory(values);
        } else {
            await handleAddAccount(values);
        }
        form.reset();
        setHandleEntity(null);
    };

    const handleAddCategory = async (values: z.infer<typeof categoryFormSchema>) => {
        if (handleEntity?.method === "PATCH") {
            try {
                const response = await fetch("/api/categories", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        categoryId: handleEntity.entityId,
                        name: values.name,
                    }),
                });
                if (handleResponse(
                    response,
                    "Category updated successfully!",
                    "Failed to update category"
                )) {
                    setIsAddEntityOpen(false);
                    router.refresh();
                }
            } catch (error) {
                handleCatchError(`Failed to update category. Please try again.${error}`);
            }
        } else {
            try {
                const response = await fetch("/api/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: values.name,
                        type: currentType,
                    }),
                });
                if (handleResponse(
                    response,
                    "Category added successfully!",
                    "Failed to add category"
                )) {
                    setIsAddEntityOpen(false);
                    router.refresh();
                }
            } catch (error) {
                handleCatchError(`Failed to add category. Please try again. ${error}`);
            }
        }
    };

    const handleAddAccount = async (values: z.infer<typeof accountFormSchema>) => {
        if (handleEntity?.method === "PATCH") {
            try {
                const response = await fetch("/api/account-type", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accountId: handleEntity.entityId,
                        name: values.name,
                    }),
                });
                if (handleResponse(
                    response,
                    "Account updated successfully!",
                    "Failed to update account"
                )) {
                    setIsAddEntityOpen(false);
                    router.refresh();
                }
            } catch (error) {
                handleCatchError(`Failed to update account. Please try again. ${error}`);
            }
        } else {
            try {
                const response = await fetch("/api/account-type", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                if (handleResponse(
                    response,
                    "Account added successfully!",
                    "Failed to add account"
                )) {
                    setIsAddEntityOpen(false);
                    router.refresh();
                }
            } catch (error) {
                handleCatchError(`Failed to add account. Please try again. ${error}`);
            }
        }
    };

    const filteredCategories = categories.filter(
        (category: { type: string; }) => category.type === currentType
    );

    return (
        <Dialog open={isAddEntityOpen} onOpenChange={setIsAddEntityOpen}>
            <DialogContent className="flex flex-col border-2 max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {entityType === "category"
                            ? `Add new ${currentType} category `
                            : "Add New Account"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={`Enter ${
                                                entityType === currentType ? "category" : "account"
                                            } name`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-4">
                            {handleEntity?.method === "PATCH" ? "Update" : "Add"}{" "}
                            {entityType === currentType ? "Category" : "Account"}
                        </Button>
                    </form>
                </Form>
                <style>
                    {`
                        .thin-scrollbar::-webkit-scrollbar {
                            width: 4px; /* Adjust the width as needed */
                            background: transparent; /* Make the scrollbar background transparent */
                        }
                        .thin-scrollbar::-webkit-scrollbar-track {
                            background: transparent; /* Make the track transparent */
                        }
                        .thin-scrollbar::-webkit-scrollbar-thumb {
                            background: transparent; /* Make the thumb transparent */
                            border-radius: 4px; /* Rounded corners for the thumb */
                        }
                        .thin-scrollbar:hover::-webkit-scrollbar-thumb {
                            background: #767676; /* Thumb color on hover */
                        }
                        .thin-scrollbar:hover::-webkit-scrollbar-track {
                            background: #000000;
                        }
                    `}
                </style>
                <div className="flex-grow p-2 border rounded shadow-lg overflow-y-auto space-y-2 will-change-scroll thin-scrollbar">
                    {entityType === "category" ? (
                        <>
                            {filteredCategories.map((category:{name:string,id:string}) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    className="py-2 px-5 w-full flex justify-between items-center rounded-lg border dark:hover:border-white hover:border-gray-600 transition-colors duration-200"
                                >
                                    <span className="text-xs">{category.name}</span>
                                    <div className="flex gap-x-3">
                                    <svg
                                                onClick={() => {
                                                    setHandleEntity({
                                                        entityId: category.id,
                                                        name: category.name,
                                                        method: "PATCH",
                                                    });
                                                    form.setValue("name", category.name);
                                                }}
                                                className="w-5 h-5 hover:text-blue-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            <Trash
                                                className="h-5 w-5 hover:text-red-400"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </>
                        ) : (
                            accounts.map((account:{name:string,id:string}) => (
                                <button
                                    key={account.id}
                                    type="button"
                                    className="py-2 px-5 w-full flex justify-between items-center rounded-lg border dark:hover:border-white hover:border-gray-600 transition-colors duration-200"
                                >
                                    <span className="text-xs">{account.name}</span>
                                    <div className="flex gap-x-3">
                                        <svg
                                            onClick={() => {
                                                setHandleEntity({
                                                    entityId: account.id,
                                                    name: account.name,
                                                    method: "PATCH",
                                                });
                                                form.setValue("name", account.name);
                                            }}
                                            className="w-5 h-5 hover:text-blue-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        <Trash
                                            className="h-5 w-5 hover:text-red-400"
                                            onClick={() => handleDeleteAccount(account.id)}
                                        />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    export default EntityFormDialog;