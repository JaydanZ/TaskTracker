import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { taskAPI } from '../../utils/tasksAPI'
import { UpdateTaskInput } from '../../types/task'
import clsx from 'clsx'

export const Route = createFileRoute('/editTsk/$taskId')({
  component: RouteComponent
})

function RouteComponent() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: task, isLoading } = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => taskAPI.getTask(taskId)
  })

  const [formData, setFormData] = useState<UpdateTaskInput>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo'
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status
      })
    }
  }, [task])

  const updateMutation = useMutation({
    mutationFn: (updates: UpdateTaskInput) =>
      taskAPI.updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] })
      navigate({ to: '/tasks' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading task...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Task not found</p>
          <button
            onClick={() => navigate({ to: '/tasks' })}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/tasks' })}
          className="text-orange-600 hover:text-orange-800 text-sm font-medium"
        >
          ← Back to Tasks
        </button>
      </div>

      <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-6">Edit Task</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/10 px-3 py-1.5 text-sm/6 text-white',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
              )}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/10 px-3 py-1.5 text-sm/6 text-white',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
              )}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
                className={clsx(
                  'mt-3 block w-full appearance-none rounded-lg border-none bg-white/10 px-3 py-1.5 text-sm/6 text-white',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                  '*:text-black'
                )}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className={clsx(
                  'mt-3 block w-full appearance-none rounded-lg border-none bg-white/10 px-3 py-1.5 text-sm/6 text-white',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                  '*:text-black'
                )}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {updateMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : 'Failed to update task'}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate({ to: '/tasks' })}
              className="flex-1 px-4 py-2 border border-red-500 bg-red-500 rounded-md hover:bg-red-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 px-4 py-2 bg-lime-400 text-black rounded-md hover:bg-lime-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
