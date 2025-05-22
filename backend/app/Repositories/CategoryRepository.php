<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{
    protected $model;

    public function __construct(Category $category)
    {
        $this->model = $category;
    }

    /**
     * Tüm kategorileri listele
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return $this->model->all();
    }

    /**
     * ID ile kategori getir
     *
     * @param int $id
     * @return Category|null
     */
    public function find(int $id)
    {
        return $this->model->find($id);
    }

    /**
     * Yeni kategori oluştur
     *
     * @param array $data
     * @return Category
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Kategori güncelle
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data)
    {
        $category = $this->find($id);
        if (!$category) {
            return false;
        }

        return $category->update($data);
    }

    /**
     * Kategori sil (soft delete yoksa kalıcı siler)
     *
     * @param int $id
     * @return bool|null
     */
    public function delete(int $id)
    {
        $category = $this->find($id);
        if (!$category) {
            return false;
        }

        return $category->delete();
    }

    /**
     * Belirli bir kategorinin todo'larını getir
     *
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getTodos(int $id)
    {
        $category = $this->find($id);
        if (!$category) {
            return null;
        }

        return $category->todos()->get();
    }
}
