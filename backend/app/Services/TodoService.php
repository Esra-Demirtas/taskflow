<?php

namespace App\Services;

use App\Repositories\TodoRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class TodoService
{
    protected $todoRepository;

    public function __construct(TodoRepository $todoRepository)
    {
        $this->todoRepository = $todoRepository;
    }

    public function getAllTodos(array $filters = [])
    {
        return $this->todoRepository->getAll($filters);
    }

    public function getTodoById(int $id)
    {
        return $this->todoRepository->findById($id);
    }

    public function createTodo(array $data)
    {
        $this->validate($data);
        return $this->todoRepository->create($data);
    }

    public function updateTodo(int $id, array $data)
    {
        $this->validate($data, $id);
        return $this->todoRepository->update($id, $data);
    }

    public function updateStatus(int $id, string $status)
    {
        // İsteğe bağlı: geçerli enum değerlerini kontrol et
        return $this->todoRepository->update($id, ['status' => $status]);
    }

    public function deleteTodo(int $id)
    {
        return $this->todoRepository->delete($id);
    }

    public function searchTodos(string $query)
    {
        return $this->todoRepository->search($query);
    }

    protected function validate(array $data, $id = null)
    {
        $rules = [
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:pending,completed,in_progress',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'required|date|after:today',
            'user_id' => 'required|exists:users,id',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
