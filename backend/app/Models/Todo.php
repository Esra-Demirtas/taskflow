<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'user_id',
    ];

   /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'due_date' => 'datetime',
    ];

    /**
     * Bir todo'nun ait olduğu kategorileri döndürür.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'todo_category', 'todo_id', 'category_id');
    }

    /**
     * Bir todo'nun ait olduğu kullanıcıyı döndürür.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}