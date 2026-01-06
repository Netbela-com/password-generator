"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Head from "next/head";

type PasswordOptions = {
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    specials: boolean;
    length: number;
};

export default function Home() {
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [options, setOptions] = useState<PasswordOptions>({
        lowercase: true,
        uppercase: true,
        numbers: true,
        specials: false,
        length: 16,
    });
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const generatePassword = useCallback(() => {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()_-+=";

        let charset = "";
        if (options.lowercase) charset += lowercase;
        if (options.uppercase) charset += uppercase;
        if (options.numbers) charset += numbers;
        if (options.specials) charset += specialChars;

        if (!charset) charset = lowercase;

        let newPassword = "";
        const cryptoObj = window.crypto;
        const uint32 = new Uint32Array(1);

        for (let i = 0; i < options.length; i++) {
            let randomValue;
            const limit = Math.floor(0xffffffff / charset.length) * charset.length;
            do {
                cryptoObj.getRandomValues(uint32);
                randomValue = uint32[0];
            } while (randomValue >= limit);
            newPassword += charset[randomValue % charset.length];
        }

        setGeneratedPassword(newPassword);
    }, [options]);

    const strength = useMemo(() => {
        let score = 0;

        // Length points (more granular)
        if (options.length >= 8) score += 1;
        if (options.length >= 12) score += 1;
        if (options.length >= 16) score += 1;
        if (options.length >= 20) score += 1;

        // Variety points
        if (options.lowercase) score += 1;
        if (options.uppercase) score += 1;
        if (options.numbers) score += 1;
        if (options.specials) score += 1;

        const variety = [options.lowercase, options.uppercase, options.numbers, options.specials].filter(Boolean).length;
        if (options.length >= 16 && variety >= 3) score += 1;

        let level;
        if (score <= 3) {
            level = { label: "Zwak", color: "bg-red-500", width: "25%" };
        } else if (score <= 5) {
            level = { label: "Matig", color: "bg-orange-500", width: "50%" };
        } else if (score <= 7) {
            level = { label: "Goed", color: "bg-yellow-500", width: "75%" };
        } else {
            level = { label: "Sterk", color: "bg-accent", width: "100%" };
        }

        return level;
    }, [options]);
    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    useEffect(() => {
        if (!showCopyMessage) return;
        const timer = setTimeout(() => setShowCopyMessage(false), 2000);
        return () => clearTimeout(timer);
    }, [showCopyMessage]);

    const handleCheckboxChange = (option: keyof PasswordOptions) => {
        setOptions(prev => ({ ...prev, [option]: !prev[option] }));
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword);
            setShowCopyMessage(true);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-4 font-sans text-zinc-200">

                {/* Toast - Uses Accent */}
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
                    showCopyMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
                }`}>
                    <div className="bg-accent text-zinc-950 px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold border border-white/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        Gekopieerd!
                    </div>
                </div>

                <div className="mb-8">
                    <a href="https://netbela.com">
                        <Image src="/logo-color.webp" alt="Netbela" width={180} height={60} className="hover:opacity-80 transition-opacity" />
                    </a>
                </div>

                <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header Image */}
                    <div className="relative h-32">
                        <Image
                            src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80"
                            alt="Security" fill className="object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                        <div className="absolute bottom-4 left-6">
                            <h1 className="text-xl font-bold text-white tracking-tight">Wachtwoord Generator</h1>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Password Display Box */}
                        <div className="relative group">
                            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 pr-14 transition-all group-hover:border-zinc-700">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Uw Wachtwoord</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={generatePassword} className="text-zinc-500 hover:text-white transition-colors" title="Nieuw wachtwoord">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        </button>
                                        <button onClick={copyToClipboard} className="text-secondary hover:text-white text-xs font-bold transition-colors">
                                            {showCopyMessage ? "GEKOPIEERD" : "KOPIEER"}
                                        </button>
                                    </div>
                                </div>
                                <div className="font-mono text-xl break-all text-white selection:bg-secondary/30">
                                    {generatedPassword}
                                </div>
                            </div>
                        </div>

                        {/* Strength Meter (UX Improvement) */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                <span className="text-zinc-500">Sterkte:</span>
                                <span className={strength.label === "Sterk" ? "text-accent" : "text-zinc-300"}>{strength.label}</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${strength.color}`}
                                    style={{ width: strength.width }}
                                />
                            </div>
                        </div>

                        {/* Length - Counter uses Primary */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-zinc-400">Lengte</label>
                                <span className="text-lg font-mono font-bold text-primary bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
                                    {options.length}
                                </span>
                            </div>
                            <input
                                type="range" min={8} max={50} value={options.length}
                                onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-secondary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ["lowercase", "Kleine letters"],
                                ["uppercase", "Hoofdletters"],
                                ["numbers", "Getallen"],
                                ["specials", "Symbolen"],
                            ].map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors group">
                                    <input
                                        type="checkbox"
                                        checked={options[key as keyof PasswordOptions] as boolean}
                                        onChange={() => handleCheckboxChange(key as keyof PasswordOptions)}
                                        disabled={key === 'lowercase'}
                                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-secondary focus:ring-secondary focus:ring-offset-zinc-900 transition-all disabled"
                                    />
                                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">{label}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-6 text-sm text-zinc-400 space-y-2 max-w-md mx-auto">
                            <p>
                                Gebruik deze gratis wachtwoord generator om sterke en veilige wachtwoorden te maken.
                                Pas de lengte aan en kies welke tekens u wilt gebruiken, zoals hoofdletters, cijfers en symbolen.
                            </p>
                            <p>
                                Sterke wachtwoorden helpen uw accounts beter te beschermen tegen hackers en datalekken.
                                Sla uw wachtwoorden veilig op en gebruik unieke combinaties voor elke service.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="mt-8 text-zinc-600 text-[10px] tracking-widest uppercase font-bold">
                    <a href="https://netbela.com" className="hover:text-secondary transition-colors">
                        © 2026 Netbela Hosting
                    </a>
                </footer>
            </div>
    );
}