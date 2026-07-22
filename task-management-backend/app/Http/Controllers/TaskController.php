<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Store a newly created task.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'status' => 'required|in:Pending,In Progress,Completed',
            'due_date' => 'nullable|date'
        ]);

        $task = Task::create($fields);

        return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
    }

    /**
     * Update specified task status and details.
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $fields = $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'status' => 'required|in:Pending,In Progress,Completed',
            'due_date' => 'nullable|date'
        ]);

        $task->update($fields);

        return response()->json(['message' => 'Task updated', 'task' => $task], 200);
    }

    /**
     * Delete a task.
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted'], 200);
    }
}