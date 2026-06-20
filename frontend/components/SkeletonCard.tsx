export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/5">
      <div className="aspect-[4/3] bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3.5 w-3/5 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-2/5 rounded bg-white/10 animate-pulse" />
        <div className="flex justify-between items-center mt-1">
          <div className="h-5 w-20 rounded bg-white/10 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
