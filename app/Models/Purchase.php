<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $table = 'purchasing';

    protected $fillable = [
        'invoice_number',
        'distributor',
        'evidence',
        'description',
        'transaction_date',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}