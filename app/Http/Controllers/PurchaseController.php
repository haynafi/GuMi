<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::where('user_id', auth()->id())
            ->select('id', 'invoice_number', 'distributor', 'transaction_date', 'description', 'evidence', 'created_at')
            ->latest()
            ->get()
            ->map(function ($purchase) {
                if ($purchase->evidence) {
                    $purchase->evidence_url = Storage::url($purchase->evidence);
                }
                return $purchase;
            });

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
        ])->withViewData(['layout' => 'AppLayout']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_number' => 'required|string|max:255|unique:purchasing,invoice_number',
            'distributor' => 'required|string|max:255',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'evidence' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = [
            'invoice_number' => $request->invoice_number,
            'distributor' => $request->distributor,
            'description' => $request->description,
            'transaction_date' => $request->transaction_date,
            'user_id' => auth()->id(),
        ];

        if ($request->hasFile('evidence')) {
            $data['evidence'] = $request->file('evidence')->store('purchasing', 'public');
        }

        Purchase::create($data);

        return redirect()->route('purchases.index')->with('status', 'Purchase added successfully!');
    }
}