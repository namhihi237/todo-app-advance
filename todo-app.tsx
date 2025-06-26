"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit3, Check, X, Calendar, Star, Eye } from "lucide-react"

interface Todo {
  id: string
  text: string
  description?: string
  completed: boolean
  createdAt: Date
  priority: "low" | "medium" | "high"
  deadline?: Date
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [deadline, setDeadline] = useState<string>("")
  const [description, setDescription] = useState("")
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
      }))
      setTodos(parsedTodos)
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        description: description.trim() || undefined,
        completed: false,
        createdAt: new Date(),
        priority,
        deadline: deadline ? new Date(deadline) : undefined,
      }
      setTodos([todo, ...todos])
      setNewTodo("")
      setDescription("")
      setPriority("medium")
      setDeadline("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEditing = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editText.trim() !== "") {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editText.trim() } : todo)))
    }
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.filter((todo) => !todo.completed).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Star className="w-3 h-3 fill-current" />
      case "medium":
        return <Star className="w-3 h-3" />
      case "low":
        return <Calendar className="w-3 h-3" />
      default:
        return null
    }
  }

  const isOverdue = (todo: Todo) => {
    if (!todo.deadline || todo.completed) return false
    return new Date() > todo.deadline
  }

  const formatDeadline = (date: Date) => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✨ Beautiful Todo
            </CardTitle>
            <p className="text-gray-600 mt-2">Stay organized and productive</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Add Todo Form */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="What needs to be done?"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    className="pr-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                  />
                  <Button
                    onClick={addTodo}
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Priority Selector */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600">Priority:</span>
                <div className="flex gap-1">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <Button
                      key={p}
                      variant={priority === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPriority(p)}
                      className={`capitalize text-xs transition-all ${
                        priority === p
                          ? p === "high"
                            ? "bg-red-500 hover:bg-red-600"
                            : p === "medium"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          : "hover:scale-105"
                      }`}
                    >
                      {getPriorityIcon(p)}
                      <span className="ml-1">{p}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Deadline Selector */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600">Deadline:</span>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="flex-1 text-sm"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {deadline && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeadline("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Description Input */}
              <div className="flex gap-2 items-start">
                <span className="text-sm text-gray-600 mt-2">Description:</span>
                <textarea
                  placeholder="Add a description (optional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 min-h-[60px] px-3 py-2 border-2 border-gray-200 rounded-md focus:border-blue-400 transition-colors resize-none text-sm"
                  rows={2}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                {activeCount} active
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                {completedCount} completed
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                {todos.length} total
              </Badge>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger value="all" className="transition-all">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="transition-all">
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed" className="transition-all">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="mt-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎯</div>
                      <p>
                        {filter === "completed"
                          ? "No completed tasks yet"
                          : filter === "active"
                            ? "No active tasks"
                            : "No tasks yet. Add one above!"}
                      </p>
                    </div>
                  ) : (
                    filteredTodos.map((todo, index) => (
                      <div
                        key={todo.id}
                        className={`group p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 animate-slide-in ${
                          isOverdue(todo)
                            ? "bg-red-50 border-red-300 shadow-red-100"
                            : todo.completed
                              ? "bg-gray-50 border-gray-200 opacity-75"
                              : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="transition-transform hover:scale-110"
                          />

                          <div className="flex-1 min-w-0">
                            {editingId === todo.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit()
                                    if (e.key === "Escape") cancelEdit()
                                  }}
                                  className="flex-1"
                                  autoFocus
                                />
                                <Button size="sm" onClick={saveEdit} className="bg-green-500 hover:bg-green-600">
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`flex-1 transition-all ${
                                      todo.completed ? "line-through text-gray-500" : "text-gray-900"
                                    }`}
                                  >
                                    {todo.text}
                                  </p>
                                  {isOverdue(todo) && (
                                    <Badge variant="destructive" className="text-xs animate-pulse">
                                      OVERDUE
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className={`text-xs ${getPriorityColor(todo.priority)}`}>
                                    {getPriorityIcon(todo.priority)}
                                    <span className="ml-1 capitalize">{todo.priority}</span>
                                  </Badge>
                                  {todo.deadline && (
                                    <Badge
                                      variant="outline"
                                      className={`text-xs flex items-center gap-1 ${
                                        isOverdue(todo)
                                          ? "bg-red-100 text-red-800 border-red-200"
                                          : "bg-blue-100 text-blue-800 border-blue-200"
                                      }`}
                                    >
                                      <Calendar className="w-3 h-3" />
                                      {formatDeadline(todo.deadline)}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-400">{todo.createdAt.toLocaleDateString()}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingId !== todo.id && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedTodo(todo)
                                    setShowTaskDetail(true)
                                  }}
                                  className="hover:bg-purple-100 hover:text-purple-600 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditing(todo.id, todo.text)}
                                  className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="hover:bg-red-100 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Task Details</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowTaskDetail(false)
                    setSelectedTodo(null)
                  }}
                  className="hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                <p className={`${selectedTodo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                  {selectedTodo.text}
                </p>
              </div>

              {selectedTodo.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                    {selectedTodo.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Priority</h3>
                  <Badge variant="outline" className={`${getPriorityColor(selectedTodo.priority)}`}>
                    {getPriorityIcon(selectedTodo.priority)}
                    <span className="ml-1 capitalize">{selectedTodo.priority}</span>
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                  <Badge variant={selectedTodo.completed ? "default" : "secondary"}>
                    {selectedTodo.completed ? "Completed" : "Active"}
                  </Badge>
                </div>
              </div>

              {selectedTodo.deadline && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Deadline</h3>
                  <Badge
                    variant="outline"
                    className={`${
                      isOverdue(selectedTodo)
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDeadline(selectedTodo.deadline)}
                  </Badge>
                  {isOverdue(selectedTodo) && (
                    <Badge variant="destructive" className="ml-2 animate-pulse">
                      OVERDUE
                    </Badge>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
                <p className="text-sm text-gray-600">{selectedTodo.createdAt.toLocaleString()}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    toggleTodo(selectedTodo.id)
                    setSelectedTodo({
                      ...selectedTodo,
                      completed: !selectedTodo.completed,
                    })
                  }}
                  className={`flex-1 ${
                    selectedTodo.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {selectedTodo.completed ? "Mark as Active" : "Mark as Complete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    startEditing(selectedTodo.id, selectedTodo.text)
                    setShowTaskDetail(false)
                    setSelectedTodo(null)
                  }}
                  className="flex-1"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx global>{`
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
`}</style>
    </div>
  )
}
