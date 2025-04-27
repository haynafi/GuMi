<?php

namespace Database\Seeders;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('email', 'test@example.com')->first();

        Purchase::create([
            'invoice_number' => 'INV-001',
            'distributor' => 'ABC Supplies',
            'description' => 'Purchase of 20 units',
            'transaction_date' => '2025-04-01',
            'evidence' => 'purchasing/sample1.jpg',
            'user_id' => $user->id,
        ]);

        Purchase::create([
            'invoice_number' => 'INV-002',
            'distributor' => 'XYZ Distributors',
            'description' => 'Purchase of 15 units',
            'transaction_date' => '2025-04-02',
            'evidence' => 'purchasing/sample2.jpg',
            'user_id' => $user->id,
        ]);
    }
}