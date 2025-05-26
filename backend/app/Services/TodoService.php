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

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
        if (isset($filters['q'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['q'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['q'] . '%');
            });
        }

        return $query->orderBy($sort, $order)->paginate($limit);
    }

    public function getTodoById(int $id): ?Todo
    {
        // Eloquent'in find() metodu zaten doğrudan modeli veya null döndürür.
        // Ancak statik analiz aracının Builder döndürdüğünü belirtmesi durumunda,
        // where() ve first() kombinasyonu daha açık olabilir.
        // Normalde Todo::find($id) yeterlidir.
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
        /** @var \App\Models\Todo|null $todo */ // Intelephense için tip ipucu
        $todo = Todo::find($id);
        if ($todo) {
            // update() metodu boolean döndürür, ancak biz güncellediğimiz $todo nesnesini döndürüyoruz.
            // Statik analiz aracının kafasını karıştırmamak için bu satırın sonucu doğrudan kullanılmaz.
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
        /** @var \App\Models\Todo|null $todo */ // Intelephense için tip ipucu
        $todo = Todo::find($id);
        if ($todo) {
            // update() metodu boolean döndürür, ancak biz güncellediğimiz $todo nesnesini döndürüyoruz.
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

    public function searchTodos(string $query): LengthAwarePaginator
    {
        return Todo::with('categories', 'user')
            ->where('title', 'like', '%' . $query . '%')
            ->orWhere('description', 'like', '%' . $query . '%')
            ->paginate(10); // Varsayılan sayfalama
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
