<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CategoryService
{
    protected $repository;

    // Validasyon kuralları
    protected $rules = [
        'name' => 'required|string|max:255',
        'color' => 'nullable|string|max:20',
    ];

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Tüm kategorileri getir
     */
    public function list()
    {
        return $this->repository->all();
    }

    /**
     * Tek kategori getir
     */
    public function getById(int $id)
    {
        return $this->repository->find($id);
    }

    /**
     * Yeni kategori oluştur
     */
    public function create(array $data)
    {
        $this->validate($data);

        return $this->repository->create($data);
    }

    /**
     * Kategori güncelle
     */
    public function update(int $id, array $data)
    {
        $this->validate($data);

        $category = $this->repository->find($id);
        if (!$category) {
            throw new \Exception("Kategori bulunamadı", 404);
        }

        $this->repository->update($id, $data);

        return $this->repository->find($id);
    }

    /**
     * Kategori sil
     */
    public function delete(int $id)
    {
        $category = $this->repository->find($id);
        if (!$category) {
            throw new \Exception("Kategori bulunamadı", 404);
        }

        return $this->repository->delete($id);
    }

    /**
     * Bir kategorinin todo'larını getir
     */
    public function getTodos(int $id)
    {
        $todos = $this->repository->getTodos($id);

        if (is_null($todos)) {
            throw new \Exception("Kategori bulunamadı", 404);
        }

        return $todos;
    }

    /**
     * Gelen veriyi validasyondan geçir
     */
    protected function validate(array $data)
    {
        $validator = Validator::make($data, $this->rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}
