<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mitra extends Model
{
    protected $table = 'mitra';
    protected $primaryKey = 'id_mitra';
    public $timestamps = false;

    protected $fillable = ['nama', 'no_hp', 'email', 'alamat', 'perusahaan', 'at'];

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class, 'id_mitra', 'id_mitra');
    }
}