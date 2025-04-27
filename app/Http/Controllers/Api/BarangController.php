<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 5);
        $barangs = Barang::with('kategori')
            ->orderBy('id_barang', 'desc')
            ->paginate($perPage);

        return response()->json($barangs);
    }

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

        return response()->json([
            'message' => 'Barang created successfully',
            'data' => $barang,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $barang = Barang::findOrFail($id);

        $validated = $request->validate([
            'id_kategori' => 'sometimes|required|exists:kategori,id_kategori',
            'nama_barang' => 'sometimes|required|string|max:255',
            'satuan' => 'sometimes|required|string|max:50',
            'stok_awal' => 'sometimes|required|integer|min:0',
            'stok_akhir' => 'sometimes|required|integer|min:0',
            'keterangan' => 'nullable|string',
            'expired_date' => 'nullable|date',
        ]);

        $barang->update($validated);

        return response()->json([
            'message' => 'Barang updated successfully',
            'data' => $barang,
        ], 200);
    }
}