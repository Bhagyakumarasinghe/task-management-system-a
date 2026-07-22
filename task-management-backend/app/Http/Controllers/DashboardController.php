<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Retrieve statistics for Dashboard Module.
     */
    public function index()
    {
        $totalTasks = Task::count();
        $pendingTasks = Task::where('status', 'Pending')->count();
        $completedTasks = Task::where('status', 'Completed')->count();

        // Tasks overdue (not completed and due date passed)
        $overdueTasks = Task::where('status', '!=', 'Completed')
            ->whereNotNull('due_date')
            ->where('due_date', '<', Carbon::now()->toDateString())
            ->count();

        return response()->json([
            'total_tasks' => $totalTasks,
            'pending_tasks' => $pendingTasks,
            'completed_tasks' => $completedTasks,
            'overdue_tasks' => $overdueTasks,
        ], 200);
    }
}