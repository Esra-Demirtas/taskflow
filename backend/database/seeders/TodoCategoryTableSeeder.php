<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TodoCategoryTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('todo_category')->insert([
            [
                'todo_id' => 1,
                'category_id' => 1,
            ],
            [
                'todo_id' => 1,
                'category_id' => 2,
            ],
            [
                'todo_id' => 2,
                'category_id' => 1,
            ],
            [
                'todo_id' => 2,
                'category_id' => 3,
            ],
        ]);
    }
}
