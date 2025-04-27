<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run()
    {
        // Get the authenticated user (or create one if needed)
        $user = User::where('email', 'test@example.com')->first();

        // Create customers
        $customer1 = Customer::create(['name' => 'John Doe', 'address' => '123 Main St']);
        $customer2 = Customer::create(['name' => 'Jane Smith', 'address' => '456 Oak Ave']);

        // Create transactions
        Transaction::create([
            'facture_number' => 'FACT-001',
            'customer_id' => $customer1->id,
            'transaction_date' => '2025-04-01',
            'description' => 'Purchase of 10 units',
            'evident' => 'purchases/sample1.jpg',
            'user_id' => $user->id,
        ]);

        Transaction::create([
            'facture_number' => 'FACT-002',
            'customer_id' => $customer2->id,
            'transaction_date' => '2025-04-02',
            'description' => 'Purchase of 5 units',
            'evident' => 'purchases/sample2.jpg',
            'user_id' => $user->id,
        ]);
    }
}