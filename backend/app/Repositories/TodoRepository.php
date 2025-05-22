<?php

namespace App\Repositories;

use App\Models\Todo;
use Illuminate\Support\Facades\DB;

class TodoRepository
{
    public function getAll(array $filters = [], int $limit = 10, string $sort = 'created_at', string $order = 'desc')
    {
        $query = Todo::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['q'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['q']}%")
                  ->orWhere('description', 'like', "%{$filters['q']}%");
            });
        }

        return $query->orderBy($sort, $order)
            ->paginate(min($limit, 50));
    }

    public function find($id)
    {
        return Todo::with('categories', 'user')->findOrFail($id);
    }

    public function create(array $data)
    {
        $todo = Todo::create($data);

        if (isset($data['category_ids'])) {
            $todo->categories()->sync($data['category_ids']);
        }

        return $todo;
    }

    public function update($id, array $data)
    {
        $todo = Todo::findOrFail($id);
        $todo->update($data);

        if (isset($data['category_ids'])) {
            $todo->categories()->sync($data['category_ids']);
        }

        return $todo;
    }

    public function updateStatus($id, $status)
    {
        $todo = Todo::findOrFail($id);
        $todo->status = $status;
        $todo->save();

        return $todo;
    }

    public function delete($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();
        return true;
    }

     public function findById(int $id): ?Todo
    {
        return Todo::find($id);
    }

    public function search(string $query, int $limit = 10, int $page = 1)
    {
        return Todo::where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->paginate($limit, ['*'], 'page', $page);
    }
} 