<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMitraTable extends Migration
{
    public function up()
    {
        Schema::create('mitra', function (Blueprint $table) {
            $table->id('id_mitra');
            $table->string('nama', 200);
            $table->string('no_hp', 20);
            $table->string('email', 200);
            $table->text('alamat');
            $table->string('perusahaan', 200);
            $table->date('at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mitra');
    }
}