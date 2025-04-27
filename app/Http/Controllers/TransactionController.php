<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::where('user_id', auth()->id())
            ->with('customer')
            ->select('id', 'facture_number', 'customer_id', 'transaction_date', 'description', 'evident', 'created_at')
            ->latest()
            ->get()
            ->map(function ($transaction) {
                if ($transaction->evident) {
                    $transaction->evidence_url = Storage::url($transaction->evident);
                }
                return $transaction;
            });

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}