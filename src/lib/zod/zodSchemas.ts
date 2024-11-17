import { z } from "zod";

export const formSchema = z.object({
    type: z.enum(["income", "expense", "transfer"], {
        required_error: "Transaction type is required",
    }),
    date: z.string({
        required_error: "Date is required",
    }),
    account: z
        .string({
            required_error: "Account is required",
        })
        .min(1, "Account is required"),
    category: z
        .string({
            required_error: "Category is required",
        })
        .min(1, "Category is required"),
    amount: z
        .string({
            required_error: "Amount is required",
        })
        .min(1, "Amount is required"),
    note: z.string(),
    description: z.optional(z.string()),
});

export const categoryFormSchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

export const accountFormSchema = z.object({
    name: z.string().min(1, "Account type name is required"),
});

export const noteSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    color: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    liked: z.boolean(),
    pinned: z.boolean(),
  });