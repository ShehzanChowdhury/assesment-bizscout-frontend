/*
* `@common` only for global/re-usable components.  
*/
export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight">HTTP Monitor Dashboard</h1>
      </div>
    </header>
  )
}
