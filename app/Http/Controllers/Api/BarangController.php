<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    // Fetch paginated barangs with kategori
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 5); // Default to 5 items per page
        $barangs = Barang::with('kategori')->paginate($perPage);
        return response()->json($barangs);
    }

    // Store a new barang
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kategori' => 'required|exists:kategori,id_kategori',
            'nama_barang' => 'required|string|max:255',
            'satuan' => 'required|string|max:50',
            'stok_awal' => 'required|integer|min:0',
            'stok_akhir' => 'required|integer|min:0',
            'keterangan' => 'nullable|string',
            'expired_date' => 'nullable|date',
        ]);

        $barang = Barang::create($validated);
        return response()->json($barang->load('kategori'), 201);
    }
}