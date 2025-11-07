import * as React from 'react'
import {
  Outlet,
  createRootRouteWithContext,
  Link,
  useNavigate
} from '@tanstack/react-router'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AuthContextType, useAuth } from 'hooks/useAuth'

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent
})

function RootComponent() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.logout()
    navigate({ to: '/login' })
  }
  return (
    <div className="min-h-screen bg-zinc-950">
      <Disclosure
        as="nav"
        className="relative bg-zinc-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}

              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
              <div className="flex shrink-0 items-center">
                <div className="text-orange-500 text-xl font-medium">
                  Task Tracker
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {auth.isAuthenticated ? (
                    <>
                      <Link
                        className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        to="/tasks"
                      >
                        Tasks
                      </Link>
                      <Link
                        className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        to="/analytics"
                      >
                        Analytics
                      </Link>
                      <button
                        className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      className="text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      to="/login"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <Link
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              to="/tasks"
            >
              Tasks
            </Link>
            <Link
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              to="/analytics"
            >
              Analytics
            </Link>
            <Link
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              to="/login"
            >
              Logout
            </Link>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Outlet />
    </div>
  )
}
