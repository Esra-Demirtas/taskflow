<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('todo_category', function (Blueprint $table) {
            $table->unsignedBigInteger('todo_id');
            $table->unsignedBigInteger('category_id');

            $table->primary(['todo_id', 'category_id']);

            $table->foreign('todo_id')->references('id')->on('todos')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('todo_category');
    }
};
