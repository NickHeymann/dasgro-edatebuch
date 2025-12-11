/**
 * Type definitions for Datebuch App
 * Minimal types for IDE autocompletion
 */

// Core Event type
interface DateEvent {
    id: string;
    title: string;
    emoji: string;
    category: string;
    date: string;
    time?: string;
    location?: string;
    coords?: [number, number];
    price?: string;
    url?: string;
    restaurant?: { name: string; coords?: [number, number] };
    bar?: { name: string; coords?: [number, number] } | { name: string; coords?: [number, number] }[];
}

// Date Builder state
interface DatePlan {
    category: string | null;
    event: DateEvent | null;
    food: 'vorher' | 'nachher' | 'nein' | null;
    drinks: 'ja' | 'nein' | null;
}

// Logger interface
interface Logger {
    error(module: string, message: string, ...args: unknown[]): void;
    warn(module: string, message: string, ...args: unknown[]): void;
    info(module: string, message: string, ...args: unknown[]): void;
    debug(module: string, message: string, ...args: unknown[]): void;
    success(module: string, message: string, ...args: unknown[]): void;
    setLevel(level: number): void;
}

// Global declarations
declare global {
    interface Window {
        logger: Logger;
        setDebugLevel: (level: number) => void;
        THREE: typeof import('three');
        L: typeof import('leaflet');
    }
}

export {};
