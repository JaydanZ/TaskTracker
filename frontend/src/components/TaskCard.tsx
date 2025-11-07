import { Link } from '@tanstack/react-router'
import { Task } from 'types/task'
import clsx from 'clsx'

interface priorities {
  low: string
  medium: string
  high: string
}

interface status {
  todo: string
  'in-progress': string
  done: string
}

function TaskCard({
  task,
  onDelete,
  onStatusChange
}: {
  task: Task
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
}) {
  const priorityColors: priorities = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  const statusColors: status = {
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800'
  }

  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done'
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-5 shadow-sm border border-zinc-800 w-full sm:w-80 flex-shrink-0">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white text-lg">{task.title}</h3>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${
              statusColors[task.status]
            }`}
          >
            {statusLabels[task.status]}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center pt-3 border-t">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
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
        <div className="flex gap-3 ml-[20px]">
          <Link
            to="/editTsk/$taskId"
            params={{ taskId: task.id }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
