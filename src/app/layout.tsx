import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Password Generator",
    description: "Password generator build with Next.js",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="nl">
        <Head>
            <title>Wachtwoord Generator | Netbela</title>
            <meta
                name="description"
                content="Genereer sterke, veilige wachtwoorden online met Netbela. Kies lengte, gebruik cijfers, symbolen, hoofdletters en meer."
            />
            <meta
                name="keywords"
                content="wachtwoord generator, sterke wachtwoorden, online tool, password generator, security, Netbela"
            />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://password.netbela.com" />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "Netbela Wachtwoord Generator",
                        "url": "https://password.netbela.com",
                        "description":
                            "Maak sterke en veilige wachtwoorden online met Netbela",
                        "applicationCategory": "SecurityApplication",
                        "operatingSystem": "Web",
                    }),
                }}
            />
        </Head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}
