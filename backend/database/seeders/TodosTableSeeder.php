<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TodosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $userId = 1; 

        $todos = [
            [
                'title' => 'Alışveriş Listesi Hazırla',
                'description' => 'Marketten alınacaklar: Süt, ekmek, yumurta, sebze.',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => Carbon::now()->addDays(2)->format('Y-m-d H:i:s'),
                'user_id' => $userId,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'deleted_at' => null,
            ],
        ];

        DB::table('todos')->insert($todos);
    }
}