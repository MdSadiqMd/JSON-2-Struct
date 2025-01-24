import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <title>JSON-2-Struct</title>
            </head>
            <body
                className={`${inter.className} bg-gray-900 text-gray-100`}
            >
                {children}
            </body>
        </html>
    );
}
