<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection; // Collection tip ipucu için

class CategoryRepository
{
    protected $model;

    public function __construct(Category $category)
    {
        $this->model = $category;
    }

    /**
     * Tüm kategorileri listeler.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * ID ile kategori getirir.
     *
     * @param int $id Kategori ID'si
     * @return \App\Models\Category|null
     */
    public function find(int $id): ?Category
    {
        // Statik analiz aracının dönüş tipini daha doğru algılaması için where()->first() kullanıldı.
        // Fonksiyonel olarak model->find($id) ile aynı sonucu verir.
        return $this->model->where('id', $id)->first();
    }

    /**
     * Yeni kategori oluşturur.
     *
     * @param array $data Oluşturulacak kategori verileri
     * @return \App\Models\Category
     */
    public function create(array $data): Category
    {
        return $this->model->create($data);
    }

    /**
     * Kategori günceller.
     *
     * @param int $id Güncellenecek kategori ID'si
     * @param array $data Güncelleme verileri
     * @return bool Güncelleme başarılı ise true, aksi halde false
     */
    public function update(int $id, array $data): bool
    {
        $category = $this->find($id);
        if (!$category) {
            return false;
        }

        return $category->update($data);
    }

    /**
     * Kategori siler (soft delete yoksa kalıcı siler).
     *
     * @param int $id Silinecek kategori ID'si
     * @return bool Silme başarılı ise true, aksi halde false
     */
    public function delete(int $id): bool
    {
        $category = $this->find($id);
        if (!$category) {
            return false;
        }

        return $category->delete();
    }

    /**
     * Belirli bir kategoriye ait tüm todoları getirir.
     *
     * @param int $id Kategori ID'si
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getTodos(int $id): ?Collection
    {
        $category = $this->find($id);
        if (!$category) {
            return null;
        }

        return $category->todos()->get();
    }
}
