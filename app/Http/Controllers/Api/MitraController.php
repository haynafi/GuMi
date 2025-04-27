<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mitra;
use Illuminate\Http\Request;

class MitraController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 5);
        $mitras = Mitra::orderBy('id_mitra', 'asc')->paginate($perPage);
        return response()->json($mitras);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:200',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:200|unique:mitra,email',
            'alamat' => 'required|string',
            'perusahaan' => 'required|string|max:200',
            'at' => 'nullable|date',
        ]);

        $mitra = Mitra::create($validated);
        return response()->json($mitra, 201);
    }

    public function update(Request $request, $id)
    {
        $mitra = Mitra::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:200',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:200|unique:mitra,email,' . $mitra->id_mitra . ',id_mitra',
            'alamat' => 'required|string',
            'perusahaan' => 'required|string|max:200',
            'at' => 'nullable|date',
        ]);

        $mitra->update($validated);
        return response()->json($mitra);
    }

    public function destroy($id)
    {
        $mitra = Mitra::findOrFail($id);
        $mitra->delete();
        return response()->json(['message' => 'Mitra deleted successfully']);
    }
}