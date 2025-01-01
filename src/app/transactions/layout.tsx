import type { Metadata } from "next";
import TransactionsLayout from "../components/TransactionsLayout";

export const metadata: Metadata = {
    title: "Finance Tracker",
    description: "Now tracking daily personal finance made easy",
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
                    <div className="h-52 w-full"></div>
                </TransactionsLayout>
            </main>
        </section>
    );
}