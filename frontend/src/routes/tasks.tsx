import { useState, useMemo } from 'react'
import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { useAuth } from 'hooks/useAuth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import TaskCard from '../components/TaskCard'
import { TaskPriority, TaskStatus } from 'types/task'
import { taskAPI } from 'utils/tasksAPI'

export const Route = createFileRoute('/tasks')({
  component: RouteComponent
})

function RouteComponent() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>(
    'all'
  )

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskAPI.getTasks
  })

  const deleteMutation = useMutation({
    mutationFn: taskAPI.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      taskAPI.updateTask(id, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status })
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter

      return matchesStatus && matchesPriority
    })
  }, [tasks, statusFilter, priorityFilter])

  const taskCounts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length
    }
  }, [tasks])

  const handleClearFilters = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
  }

  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-white">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">Tasks</h1>
          <p className="text-zinc-100 mt-1 font-medium">
            Welcome back, {auth.user?.user_id}!
          </p>
        </div>
        <Link
          to="/addTask"
          className="px-4 py-2 bg-orange-600 font-semibold text-white rounded-md hover:bg-orange-700"
        >
          + New Task
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TaskStatus | 'all')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All ({taskCounts.all})</option>
              <option value="todo">To Do ({taskCounts.todo})</option>
              <option value="in-progress">
                In Progress ({taskCounts['in-progress']})
              </option>
              <option value="done">Done ({taskCounts.done})</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as TaskPriority | 'all')
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {tasks.length === 0 ? (
            <>
              <p className="text-gray-500 text-lg">No tasks yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Click "New Task" to create your first task
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg">
                No tasks match your filters
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or{' '}
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  clear all filters
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
