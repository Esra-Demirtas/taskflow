<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
     protected $fillable = [
        'name',
        'color',
    ];
   
    /**
     * Bir kategorinin sahip olduğu todoları döndürür.
    */    public function todos()
    {
        return $this->belongsToMany(Todo::class, 'todo_category', 'category_id', 'todo_id');
    }
}