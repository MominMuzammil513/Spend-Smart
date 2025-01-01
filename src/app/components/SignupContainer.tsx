"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import SignupPresenter from "./SignupPresenter";
import { FormSchema, loginFormSchema } from "@/lib/ZodSchmas/signup-login";


export default function SignupContainer() {
  const [isLoading, setIsLoading] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      cpassword: "",
      email: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(1);
    const res = await fetch(`/api/users/signup`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json;",
      },
    });

    if (res.status === 200) {
      toast({
        variant: "default",
        title: `Congratulations ${data.username} `,
        description: "New account has been created, please proceed to login",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uhh ohh!!",
        description: "Hold tight, looks like something went wrong let us check.",
      });
    }
    setIsLoading(2);
  };

  const processLogin = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(1);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsLoading(0);
    if (res?.status !== 200) {
      toast({
        variant: "destructive",
        title: "Uhh ohh!!",
        description: "looks like you entered wrong email or password.",
      });
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: "Successfully logged in. Yayy!",
      });
      router.push("/transactions")
    }
  };

  return (
    <SignupPresenter
      form={form}
      loginForm={loginForm}
      onSubmit={onSubmit}
      processLogin={processLogin}
      isLoading={isLoading}
    />
  );
}