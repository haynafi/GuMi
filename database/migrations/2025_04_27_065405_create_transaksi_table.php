<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransaksiTable extends Migration
{
    public function up()
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id('id_transaksi');
            $table->unsignedBigInteger('id_barang');
            $table->unsignedBigInteger('id_mitra'); // Changed to unsignedBigInteger
            $table->enum('jenis_transaksi', ['MASUK', 'KELUAR']);
            $table->integer('jumlah');
            $table->dateTime('tanggal_transaksi')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->date('return_date')->nullable();
            $table->text('keterangan')->nullable();

            $table->foreign('id_barang')->references('id_barang')->on('barang')->onDelete('cascade');
            $table->foreign('id_mitra')->references('id_mitra')->on('mitra')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('transaksi');
    }
}