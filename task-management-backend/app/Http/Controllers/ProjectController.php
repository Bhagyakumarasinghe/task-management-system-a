<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index()
    {
        $projects = Project::with('user:id,name')->withCount('tasks')->get();
        return response()->json($projects, 200);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Completed,On Hold'
        ]);

        $project = Project::create([
            'user_id' => $request->user()->id,
            'title' => $fields['title'],
            'description' => $fields['description'] ?? null,
            'status' => $fields['status']
        ]);

        return response()->json(['message' => 'Project created', 'project' => $project], 201);
    }

    /**
     * Display the specified project with tasks.
     */
    public function show($id)
    {
        $project = Project::with(['tasks.assignee:id,name'])->findOrFail($id);
        return response()->json($project, 200);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Active,Completed,On Hold'
        ]);

        $project->update($fields);

        return response()->json(['message' => 'Project updated', 'project' => $project], 200);
    }

    /**
     * Remove the specified project.
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}