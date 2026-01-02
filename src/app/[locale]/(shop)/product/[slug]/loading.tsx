export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image gallery skeleton */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
            {/* Thumbnail row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
              <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            {/* Category */}
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            
            {/* Title */}
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            
            {/* Price */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Short description */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200" />
              <div className="h-12 flex-1 animate-pulse rounded-full bg-gray-200" />
            </div>

            {/* Wishlist button */}
            <div className="h-12 w-full animate-pulse rounded-full bg-gray-200" />

            {/* Accordion sections */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-16">
          <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
