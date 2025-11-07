import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { taskAPI } from '../utils/tasksAPI'
import { useAuth } from '../hooks/useAuth'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export const Route = createFileRoute('/analytics')({
  component: RouteComponent
})

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const COLORS = {
  todo: '#3B82F6',
  inProgress: '#8B5CF6',
  done: '#10B981',
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#6B7280'
}

function RouteComponent() {
  const auth = useAuth()

  // Fetch stats from backend
  const {
    data: stats,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['taskStats'],
    queryFn: taskAPI.getStats
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    todoTasks,
    inProgressTasks,
    averageCompletionTime,
    completedTasksCount,
    priorityBreakdown
  } = stats

  // Prepare data for status chart
  const statusData = [
    { name: 'To Do', value: todoTasks, color: COLORS.todo },
    { name: 'In Progress', value: inProgressTasks, color: COLORS.inProgress },
    { name: 'Done', value: completedTasks, color: COLORS.done }
  ]

  // Prepare data for priority chart
  const priorityData = [
    { name: 'High', value: priorityBreakdown.high, color: COLORS.high },
    { name: 'Medium', value: priorityBreakdown.medium, color: COLORS.medium },
    { name: 'Low', value: priorityBreakdown.low, color: COLORS.low }
  ]

  // Prepare data for completion chart
  const completionData = [
    { name: 'Completed', value: completedTasks, color: COLORS.done },
    { name: 'Pending', value: pendingTasks, color: COLORS.medium }
  ]

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-600">Analytics</h1>
        <p className="text-white font-medium mt-1">
          Overview of your task performance, {auth.user?.user_id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {totalTasks}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {completedTasks}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {totalTasks > 0
                  ? `${Math.round(
                      (completedTasks / totalTasks) * 100
                    )}% complete`
                  : '0% complete'}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900  p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Pending</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {pendingTasks}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {totalTasks > 0
                  ? `${Math.round(
                      (pendingTasks / totalTasks) * 100
                    )}% remaining`
                  : '0% remaining'}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Average Completion Time
        </h2>
        {completedTasksCount > 0 ? (
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-blue-600">
              {averageCompletionTime.toFixed(1)}
            </p>
            <p className="text-xl text-gray-200 mb-1">days</p>
          </div>
        ) : (
          <p className="text-gray-400">
            No completed tasks yet to calculate average time
          </p>
        )}
        <p className="text-sm text-gray-400 mt-2">
          Based on {completedTasksCount} completed task
          {completedTasksCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Tasks by Status
          </h2>
          {totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="white" />
                <XAxis dataKey="name" stroke="white" />
                <YAxis allowDecimals={false} stroke="white" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No tasks to display
            </p>
          )}
        </div>

        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Tasks by Priority
          </h2>
          {totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="white" />
                <XAxis dataKey="name" stroke="white" />
                <YAxis allowDecimals={false} stroke="white" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No tasks to display
            </p>
          )}
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Completion Overview
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300} className="md:w-1/2">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {completionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      {entry.name}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {entry.value} (
                      {Math.round((entry.value / totalTasks) * 100)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
