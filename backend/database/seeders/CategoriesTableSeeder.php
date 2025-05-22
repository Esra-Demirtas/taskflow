<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('categories')->insert([
            [
                'name' => 'Kişisel',
                'color' => '#FF5733',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'İş',
                'color' => '#33C1FF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Önemli',
                'color' => '#33FF57',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Diğer',
                'color' => '#AAAAAA',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
