<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'assigned_to',
        'title',
        'description',
        'priority',
        'status',
        'due_date',
    ];

    /**
     * Get the project that owns the task.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user assigned to the task.
     */
    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}