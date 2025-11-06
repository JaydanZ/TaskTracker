import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@headlessui/react'
import type { AnyFieldApi } from '@tanstack/react-form'

export const Route = createFileRoute('/login')({
  component: RouteComponent
})

const MIN_USER_ID_LENGTH = 3

// function FieldInfo({ field }: { field: AnyFieldApi }) {
//   return (
//     <>
//       {field.state.meta.isTouched && !field.state.meta.isValid ? (
//         <em>{field.state.meta.errors.join(', ')}</em>
//       ) : null}
//       {field.state.meta.isValidating ? 'Validating...' : null}
//     </>
//   )
// }

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      userid: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    }
  })

  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="w-[500px] h-[400px] bg-zinc-900 flex flex-col items-start p-6 rounded-md">
        <div className="text-white font-medium text-[2rem]">
          Enter your Information
        </div>
        <form>
          <div className="py-4">
            <form.Field
              name="userid"
              // validators={{
              //   onChange: ({ value }) =>
              //     !value
              //       ? 'A user ID is required.'
              //       : value.length < MIN_USER_ID_LENGTH
              //         ? 'User ID must be at least 3 characters long.'
              //         : undefined,
              //   onChangeAsyncDebounceMs: 500,
              //   onChangeAsync: async ({ value }) => {
              //     await new Promise((resolve) => setTimeout(resolve, 1000))
              //     return (
              //       value.includes('error') &&
              //       'No "error" allowed in first name'
              //     )
              //   }
              // }}
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
                    />
                    {/* <FieldInfo field={field} /> */}
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
                    />
                    {/* <FieldInfo field={field} /> */}
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
            {/* <Button
              className="rounded w-[150px] bg-zinc-950 text-white px-4 py-2 font-bold text-[1.5rem]"
              onClick={form.reset}
              type="reset"
            >
              Reset
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  )
}
