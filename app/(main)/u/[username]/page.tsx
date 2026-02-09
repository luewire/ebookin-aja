'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LegacyProfileRedirect() {
    const { username } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (username) {
            router.replace(`/user/${username}`);
        } else {
            router.replace('/');
        }
    }, [username, router]);

    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
    );
}
