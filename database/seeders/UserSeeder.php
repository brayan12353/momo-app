<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Kiosk Agent',
            'email' => 'agent@example.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'category' => 'kiosk',
        ]);

        User::create([
            'name' => 'Supermarket Agent',
            'email' => 'supermarket@example.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'category' => 'supermarket',
        ]);
    }
}
