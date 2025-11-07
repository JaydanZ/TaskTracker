import {
  createFileRoute,
  Link,
  redirect,
  useNavigate
} from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/login')({
  component: RouteComponent
})

function RouteComponent() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      userid: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      setError('')

      if (!value.userid || !value.password) {
        setError('UserID and / or Password cannot be blank')
        return
      }

      const user_id = value.userid
      const password = value.password

      try {
        const response = await auth.login({ user_id, password })

        navigate({ to: '/tasks' })
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Login failed')
      }
    }
  })

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 flex justify-center items-center">
      <div className="w-[500px] h-[430px] bg-zinc-900 flex flex-col items-start p-6 rounded-md">
        <div className="text-white font-medium text-[2rem]">
          Enter your Information
        </div>
        <form>
          <div className="py-4">
            <form.Field
              name="userid"
              children={(field) => {
                return (
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-white"
                      htmlFor={field.name}
                    >
                      User ID:
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                      )}
                    />
                  </div>
                )
              }}
            />
          </div>
          <div className="py-4">
            <form.Field
              name="password"
              children={(field) => {
                return (
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-white"
                      htmlFor={field.name}
                    >
                      Password:
                    </label>
                    <input
                      id={field.name}
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={clsx(
                        'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                      )}
                    />
                  </div>
                )
              }}
            />
          </div>
          <div className="flex flex-row justify-start mt-auto">
            <Button
              className="rounded w-[150px] mr-4 bg-orange-500 text-zinc-950 px-4 py-2 font-bold text-[1.5rem] data-hover:bg-orange-600"
              onClick={form.handleSubmit}
            >
              Login
            </Button>
          </div>
        </form>
        {error.length > 0 && (
          <div className="text-red-500 font-bold">{error}</div>
        )}
        <div className="flex flex-row justify-center pt-5">
          <label className="font-medium text-zinc-400 pr-2">
            Don't have an account?
          </label>
          <Link to="/register">
            <label className="font-semibold text-orange-500">Register</label>
          </Link>
        </div>
      </div>
    </div>
  )
}
