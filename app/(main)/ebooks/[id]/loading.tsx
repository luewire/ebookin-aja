export default function LoadingEbookDetails() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Back Button Skeleton */}
            <div className="mb-8 h-6 w-24 rounded skeleton"></div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] lg:gap-16">
                {/* Cover Skeleton */}
                <div className="w-full">
                    <div className="aspect-[2/3] w-full rounded-2xl skeleton shadow-md"></div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="h-6 w-32 rounded-full skeleton"></div>
                        <div className="h-10 w-3/4 rounded skeleton"></div>
                        <div className="h-6 w-1/2 rounded skeleton"></div>
                    </div>

                    <div className="flex gap-4">
                        <div className="h-12 w-32 rounded-xl skeleton"></div>
                        <div className="h-12 w-12 rounded-xl skeleton"></div>
                    </div>

                    <div className="space-y-4 pt-6">
                        <div className="h-6 w-24 rounded skeleton mb-4"></div>
                        <div className="h-4 w-full rounded skeleton"></div>
                        <div className="h-4 w-full rounded skeleton"></div>
                        <div className="h-4 w-5/6 rounded skeleton"></div>
                        <div className="h-4 w-4/5 rounded skeleton"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
