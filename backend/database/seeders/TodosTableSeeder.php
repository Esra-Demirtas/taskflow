<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TodosTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('todos')->insert([
            [
                'title' => 'Proje Planlaması',
                'description' => 'Proje için detaylı planlama yapılacak.',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => '2025-06-30 18:00:00',
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ],
            [
                'title' => 'API Geliştirme',
                'description' => 'REST API uç noktaları hazırlanacak.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => '2025-07-15 18:00:00',
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ],
            [
                'title' => 'Testlerin Yazılması',
                'description' => 'Tüm API uç noktaları için testler oluşturulacak.',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ],
        ]);
    }
}
