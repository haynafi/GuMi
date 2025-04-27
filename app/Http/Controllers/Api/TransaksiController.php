<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Barang;
use Illuminate\Http\Request;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 5);
        $query = Transaksi::with(['mitra', 'barang'])
            ->orderBy('tanggal_transaksi', 'desc');

        // Optional filtering by jenis_transaksi if provided
        if ($request->has('jenis_transaksi')) {
            $query->where('jenis_transaksi', $request->query('jenis_transaksi'));
        }

        $transaksis = $query->paginate($perPage);

        return response()->json($transaksis);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_barang' => 'required|exists:barang,id_barang',
            'id_mitra' => 'required|exists:mitra,id_mitra',
            'jenis_transaksi' => 'required|in:MASUK,KELUAR',
            'jumlah' => 'required|integer|min:1',
            'tanggal_transaksi' => 'required|date',
            'return_date' => 'nullable|date|after_or_equal:tanggal_transaksi',
            'keterangan' => 'nullable|string',
        ]);

        // Fetch the barang to update stock
        $barang = Barang::findOrFail($validated['id_barang']);

        // Update stock based on transaction type
        if ($validated['jenis_transaksi'] === 'KELUAR') {
            if ($barang->stok_akhir < $validated['jumlah']) {
                return response()->json([
                    'message' => 'Insufficient stock available.',
                    'errors' => ['jumlah' => ['The requested quantity exceeds the available stock.']],
                ], 422);
            }
            $barang->stok_akhir -= $validated['jumlah'];
        } elseif ($validated['jenis_transaksi'] === 'MASUK') {
            $barang->stok_akhir += $validated['jumlah'];
        }

        $barang->save();

        // Create the transaction
        $transaksi = Transaksi::create($validated);

        return response()->json([
            'message' => 'Transaksi created successfully',
            'data' => $transaksi->load(['mitra', 'barang']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $transaksi = Transaksi::findOrFail($id);

        // Validate that this is a KELUAR transaction being returned
        if ($transaksi->jenis_transaksi !== 'KELUAR') {
            return response()->json([
                'message' => 'This transaction is not an outgoing transaction.',
            ], 422);
        }

        $validated = $request->validate([
            'return_date' => 'required|date',
            'keterangan' => 'nullable|string',
        ]);

        // Update the transaction with the actual return date (updated_at) and max return date (return_date)
        $transaksi->return_date = $transaksi->return_date; // Keep the max return date as-is
        $transaksi->keterangan = $validated['keterangan'] ?? $transaksi->keterangan;
        $transaksi->updated_at = $validated['return_date']; // Use return_date as the actual return date
        $transaksi->save();

        // Update stock: Return the item (increase stock)
        $barang = Barang::findOrFail($transaksi->id_barang);
        $barang->stok_akhir += $transaksi->jumlah;
        $barang->save();

        return response()->json([
            'message' => 'Item returned successfully',
            'data' => $transaksi->load(['mitra', 'barang']),
        ], 200);
    }
}