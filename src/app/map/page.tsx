
'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

const Map = dynamic(
    () => import('@/components/Map'),
    {
        loading: () => (
            <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)] bg-slate-950 text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p>Loading Map data...</p>
                </div>
            </div>
        ),
        ssr: false
    }
);

export default function MapPage() {

    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-900">
            <Map />
        </div>
    );
}
