"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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
        uppercase: false,
        numbers: false,
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
        for (let i = 0; i < options.length; i++) {
            newPassword += charset.charAt(
                Math.floor(Math.random() * charset.length)
            );
        }

        setGeneratedPassword(newPassword);
    }, [options]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    useEffect(() => {
        if (!showCopyMessage) return;
        const timer = setTimeout(() => setShowCopyMessage(false), 2000);
        return () => clearTimeout(timer);
    }, [showCopyMessage]);

    function handleCheckboxChange(option: keyof PasswordOptions) {
        if (typeof options[option] === "boolean") {
            setOptions(prev => ({
                ...prev,
                [option]: !prev[option],
            }));
        }
    }

    function handleLengthChange(e: React.ChangeEvent<HTMLInputElement>) {
        setOptions(prev => ({
            ...prev,
            length: parseInt(e.target.value, 10),
        }));
    }

    async function copyToClipboard() {
        try {
            setShowCopyMessage(true);

            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(generatedPassword);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = generatedPassword;
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error("Copy failed", err);
            setShowCopyMessage(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 px-4">

            {/* Copy toast */}
            <div
                className={`fixed top-6 transition-all duration-300 ${
                    showCopyMessage
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-6"
                }`}
            >
                <div className="bg-accent text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    Password copied
                </div>
            </div>

            <div className="flex items-center pb-4 gap-2">
                <a href="https://netbela.com">
                    <Image
                        src="/logo-color.webp"
                        alt="Netbela"
                        width={256}
                        height={256}
                    />
                </a>
            </div>
            {/* Card */}
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden card-hover">

                {/* Header */}
                <div className="relative h-40">
                    <Image
                        src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80"
                        alt="Security"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90" />

                    {/* Title */}
                    <div className="absolute bottom-4 left-5">
                        <h1 className="font-heading text-2xl font-bold text-white">
                            Wachtwoord Generator
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            Genereer een veilig random wachtwoord
                        </p>
                    </div>
                </div>

                {/* Password */}
                <div className="p-5">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2 text-xs text-zinc-400">
                            <span>Generated password</span>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-1 text-secondary hover:text-accent transition"
                            >
                                Copy
                            </button>
                        </div>
                        <div className="font-mono text-lg break-all text-accent">
                            {generatedPassword}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="p-5 pt-0 space-y-6">

                    {/* Length */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm text-zinc-300">
                                Password length
                            </label>
                            <span className="text-xs bg-zinc-950 px-2 py-1 rounded text-accent font-mono">
                                {options.length}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={8}
                            max={32}
                            value={options.length}
                            onChange={handleLengthChange}
                            className="w-full h-2 rounded-lg bg-zinc-800 cursor-pointer"
                        />
                    </div>

                    {/* Character types */}
                    <div>
                        <h6 className="text-sm text-zinc-300 mb-3 border-b border-zinc-800 pb-2">
                            Character types
                        </h6>

                        <div className="space-y-3">
                            {[
                                ["lowercase", "Lowercase (a–z)"],
                                ["uppercase", "Uppercase (A–Z)"],
                                ["numbers", "Numbers (0–9)"],
                                ["specials", "Special characters"],
                            ].map(([key, label]) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 text-sm text-zinc-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={options[key as keyof PasswordOptions] as boolean}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                key as keyof PasswordOptions
                                            )
                                        }
                                        className="rounded bg-zinc-800 border-zinc-700 text-accent focus:ring-accent"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-zinc-500">
                <a href="https://netbela.com" className="hover:text-accent">
                    Made with ❤️ by Netbela
                </a>
            </div>
        </div>
    );
}