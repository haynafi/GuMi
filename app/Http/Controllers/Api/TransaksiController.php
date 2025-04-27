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
        $transaksis = Transaksi::with(['mitra', 'barang'])
            ->orderBy('tanggal_transaksi', 'desc')
            ->paginate($perPage);

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
        'data' => $transaksi,
    ], 201);
}

    public function returnItem(Request $request, $id)
    {
        $transaksi = Transaksi::findOrFail($id);

        if ($transaksi->jenis_transaksi !== 'KELUAR') {
            return response()->json(['error' => 'This transaction is not an outgoing transaction'], 422);
        }

        if ($transaksi->return_date && now()->toDateString() > $transaksi->return_date) {
            return response()->json(['error' => 'Return date has passed'], 422);
        }

        $barang = Barang::find($transaksi->id_barang);

        $newTransaksi = Transaksi::create([
            'id_barang' => $transaksi->id_barang,
            'id_mitra' => $transaksi->id_mitra,
            'jenis_transaksi' => 'MASUK',
            'jumlah' => $transaksi->jumlah,
            'tanggal_transaksi' => now()->toDateString(),
            'keterangan' => 'Return of transaction #' . $transaksi->id_transaksi,
        ]);

        $barang->stok_akhir += $transaksi->jumlah;
        $barang->save();

        return response()->json($newTransaksi->load(['mitra', 'barang']), 201);
    }
}