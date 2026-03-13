// Shows a lightweight skeleton for the hero area during route transitions.
// This prevents a blank white flash while homeSettings is being fetched.
export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero skeleton — matches hero aspect ratios to prevent CLS */}
      <div className="relative w-full">
        {/* Desktop skeleton */}
        <div className="hidden aspect-[2560/1024] w-full animate-pulse bg-stone-200 md:block" />
        {/* Mobile skeleton */}
        <div className="aspect-[1080/1475] w-full animate-pulse bg-stone-200 md:hidden" />
      </div>
      {/* Below-fold skeleton placeholder */}
      <div className="bg-[#f7f6f2] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
            <div className="h-5 w-64 animate-pulse rounded bg-stone-200" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-square w-full animate-pulse rounded-xl bg-stone-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
