<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Todo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'user_id'
    ];

    // İlişki: Her todo bir kullanıcıya aittir
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // İlişki: Her todo birçok kategoriye ait olabilir (many-to-many)
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'todo_category');
    }
}
