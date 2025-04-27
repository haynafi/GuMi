<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBarangTable extends Migration
{
    public function up()
    {
        Schema::create('barang', function (Blueprint $table) {
            $table->id('id_barang');
            $table->integer('id_kategori');
            $table->string('nama_barang', 200);
            $table->string('satuan', 50);
            $table->integer('stok_awal');
            $table->integer('stok_akhir');
            $table->text('keterangan')->nullable();
            $table->date('expired_date')->nullable();

            $table->foreign('id_kategori')->references('id_kategori')->on('kategori')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('barang');
    }
}