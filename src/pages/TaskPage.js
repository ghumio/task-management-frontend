import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const response = await api.post("/tasks", formData);
      setTasks([...tasks, response.data]);
      setFormData({ title: "", description: "", completed: false });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !editingTask) return;

    try {
      const response = await api.put(`/tasks/${editingTask._id}`, formData);
      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? response.data : task
        )
      );
      setEditingTask(null);
      setFormData({ title: "", description: "", completed: false });
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await api.put(`/tasks/${task._id}`, updatedTask);
      setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", completed: false });
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", completed: false });
    setShowCreateForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.user?.username}! Manage your tasks
                efficiently.
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className="mr-2 -ml-1 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Task
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingTask) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <form
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter task description (optional)"
                />
              </div>

              {editingTask && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed}
                    onChange={(e) =>
                      setFormData({ ...formData, completed: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="completed"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Mark as completed
                  </label>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={editingTask ? cancelEdit : resetForm}
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No tasks yet
              </h3>
              <p className="mt-2 text-gray-500">
                Get started by creating your first task!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    task.completed ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="mt-1 flex-shrink-0"
                        >
                          <div
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                              task.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-green-400"
                            }`}
                          >
                            {task.completed && (
                              <svg
                                className="h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-medium transition-all duration-200 ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p
                              className={`mt-1 text-sm transition-all duration-200 ${
                                task.completed
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              Created:{" "}
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                            {task.updatedAt !== task.createdAt && (
                              <span>
                                Updated:{" "}
                                {new Date(task.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>

                      <button
                        onClick={() => startEdit(task)}
                        className="inline-flex items-center p-2 border border-transparent text-sm leading-4 font-medium rounded text-blue-600 hover:text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        title="Edit task"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="inline-flex items-center p-2 border border-transparent text-sm leading-4 font-medium rounded text-red-600 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        title="Delete task"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Task Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {tasks.length}
                </div>
                <div className="text-sm text-blue-700">Total Tasks</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter((t) => t.completed).length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {tasks.filter((t) => !t.completed).length}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
