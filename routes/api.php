<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\MitraController;
use App\Http\Controllers\Api\TransaksiController;

Route::get('/barangs', [BarangController::class, 'index']);
Route::post('/barangs', [BarangController::class, 'store']);
Route::put('/barangs/{id}', [BarangController::class, 'update']);
Route::get('/mitras', [MitraController::class, 'index']);
Route::post('/mitras', [MitraController::class, 'store']);
Route::put('/mitras/{id}', [MitraController::class, 'update']);
Route::delete('/mitras/{id}', [MitraController::class, 'destroy']);
Route::get('/transaksis', [TransaksiController::class, 'index']);
Route::post('/transaksis', [TransaksiController::class, 'store']);
Route::put('/transaksis/{id}', [TransaksiController::class, 'update']);
