<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('sender_id');
    $table->unsignedBigInteger('receiver_id')->nullable();
    $table->unsignedBigInteger('operator_id');
    $table->enum('transaction_type', ['deposit', 'withdraw']);
    $table->decimal('amount', 15, 2);
    $table->string('status')->default('pending');
    $table->timestamps();

    $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('operator_id')->references('id')->on('operators')->onDelete('cascade');
});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
