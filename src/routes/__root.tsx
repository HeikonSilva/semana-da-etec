import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
  <>
    <div className="flex h-screen select-none bg-linear-to-r from-emerald-100 to-violet-50 p-8 antialiased dark:from-emerald-950 dark:via-sky-900 dark:to-violet-950">
      <div className="flex h-full w-full flex-row rounded-lg border border-zinc-50 shadow-lg shadow-zinc-950/60 dark:border-black">
        <nav className="flex h-full w-1/5 flex-col rounded-l-lg border border-r bg-zinc-800/70 p-4 backdrop-blur-3xl dark:border-zinc-500 dark:border-r-black">
          <div className="space-y-1">
            <span className="font-semibold text-xs dark:text-zinc-500">
              Principal
            </span>
            <Link
              activeProps={{
                className:
                  'bg-zinc-400/50 text-zinc-950 dark:bg-zinc-500/60 dark:text-zinc-50',
              }}
              className="flex h-6 flex-row items-center gap-3 rounded-md px-3 font-semibold text-sm text-zinc-800 transition-colors hover:bg-zinc-400/30 dark:text-zinc-200"
              to="/"
            >
              <span>Home</span>
            </Link>
            <Link
              activeProps={{
                className:
                  'bg-zinc-400/50 text-zinc-950 dark:bg-zinc-500/60 dark:text-zinc-50',
              }}
              className="flex h-6 flex-row items-center gap-3 rounded-md px-3 font-semibold text-sm text-zinc-800 transition-colors hover:bg-zinc-400/30 dark:text-zinc-200"
              to="/sales"
            >
              <span>Vendas</span>
            </Link>
            <Link
              activeProps={{
                className:
                  'bg-zinc-400/50 text-zinc-950 dark:bg-zinc-500/60 dark:text-zinc-50',
              }}
              className="flex h-6 flex-row items-center gap-3 rounded-md px-3 font-semibold text-sm text-zinc-800 transition-colors hover:bg-zinc-400/30 dark:text-zinc-200"
              to="/report"
            >
              <span>Relatório</span>
            </Link>
          </div>
        </nav>
        <div className="flex max-h-full w-4/5 flex-col overflow-y-auto rounded-r-lg border border-l-0 bg-zinc-800 dark:border-zinc-500">
          <div className="flex h-14 w-full items-center border-b bg-zinc-700 pl-4">
            <h1 className="font-bold dark:text-zinc-100">Home</h1>
          </div>
          <div className="flex max-h-[calc(100%-56px)] flex-1 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  </>
)

export const Route = createRootRoute({ component: RootLayout })
