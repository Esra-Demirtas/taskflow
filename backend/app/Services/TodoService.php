<?php

namespace App\Services;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TodoService
{
    public function getAllTodos(array $filters, int $limit, string $sort, string $order): LengthAwarePaginator
    {
        $query = Todo::with('categories', 'user');

        // 'q' filtresi (arama terimi) burada da zaten uygulanmış durumda
        if (isset($filters['q'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['q'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['q'] . '%');
            });
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
       
        // Limit zaten dışarıdan geliyor, paginate fonksiyonuna aktarılıyor
        return $query->orderBy($sort, $order)->paginate($limit);
    }

    public function getTodoById(int $id): ?Todo
    {
        return Todo::with('categories', 'user')->where('id', $id)->first();
    }

    public function createTodo(array $data): Todo
    {
        $todo = Todo::create($data);
        if (isset($data['category_ids'])) {
            $todo->categories()->sync($data['category_ids']);
        }
        return $todo->load('categories', 'user');
    }

    public function updateTodo(int $id, array $data): ?Todo
    {
        /** @var \App\Models\Todo|null $todo */
        $todo = Todo::find($id);
        if ($todo) {
            $todo->update($data);
            if (array_key_exists('category_ids', $data)) {
                if ($data['category_ids'] === null || count($data['category_ids']) === 0) {
                    $todo->categories()->detach();
                } else {
                    $todo->categories()->sync($data['category_ids']);
                }
            }
            return $todo->load('categories', 'user');
        }
        return null;
    }

    public function updateStatus(int $id, string $status): ?Todo
    {
        /** @var \App\Models\Todo|null $todo */
        $todo = Todo::find($id);
        if ($todo) {
            $todo->update(['status' => $status]);
            return $todo->load('categories', 'user');
        }
        return null;
    }

    public function deleteTodo(int $id): bool
    {
        $todo = Todo::find($id);
        if ($todo) {
            return $todo->delete();
        }
        return false;
    }

    /**
     * Todolar arasında arama yapar ve sayfalı sonuç döndürür.
     *
     * @param string $query Arama sorgusu
     * @param int $limit Sayfalama limiti
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function searchTodos(string $query, int $limit = 10): LengthAwarePaginator
    {
        return Todo::with('categories', 'user')
            ->where('title', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->paginate($limit); // Limit doğrudan buradan alınabilir veya controller'dan gönderilebilir
    }

    /**
     * Todo istatistiklerini döndürür.
     *
     * @return array
     */
    public function getTodoStats(): array
    {
        return [
            'pending' => Todo::where('status', 'pending')->count(),
            'in_progress' => Todo::where('status', 'in_progress')->count(),
            'completed' => Todo::where('status', 'completed')->count(),
            'cancelled' => Todo::where('status', 'cancelled')->count(),
            'total' => Todo::count(),
            'overdue' => Todo::where('due_date', '<', now())->whereIn('status', ['pending', 'in_progress'])->count(),
        ];
    }
}