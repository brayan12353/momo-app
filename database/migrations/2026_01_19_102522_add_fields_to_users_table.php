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
        Schema::table('users', function (Blueprint $table) {
    $table->string('role')->default('agent'); // agent or admin
    $table->enum('category', ['kiosk', 'supermarket'])->default('kiosk');
    $table->unsignedBigInteger('kiosk_id')->nullable();
    $table->decimal('balance', 15, 2)->default(0);
    $table->foreign('kiosk_id')->references('id')->on('kiosks')->onDelete('set null');
});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
