import type { Metadata } from "next";
import TransactionsLayout from "../components/TransactionsLayout";

export const metadata: Metadata = {
    title: "finance tracker",
    description: "Now tracking the daily personal finance made easy",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            {/* <NavBar /> */}
            <main className="">
                <TransactionsLayout>
                    {children}
                    <div className='h-52 w-full'></div>
                </TransactionsLayout>
            </main>
        </section>
    );
}
