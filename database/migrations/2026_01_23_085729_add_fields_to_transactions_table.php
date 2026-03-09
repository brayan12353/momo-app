<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {

            // Customer phone number (kiosk use)
            $table->string('customer_phone')->after('receiver_id');

            // Agent phone (phone used during registration)
            $table->string('agent_phone')->after('customer_phone');

            // Commission earned by agent
            $table->decimal('commission', 15, 2)->default(0)->after('amount');

            // Optional proof image
            $table->string('photo')->nullable()->after('commission');

            // Exact transaction time (server / country time)
            $table->timestamp('transaction_time')->after('photo');

        });

        // Update enum to support TRANSFER
        DB::statement("ALTER TABLE transactions MODIFY transaction_type ENUM('deposit','withdraw','transfer')");
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'customer_phone',
                'agent_phone',
                'commission',
                'photo',
                'transaction_time',
            ]);
        });

        DB::statement("ALTER TABLE transactions MODIFY transaction_type ENUM('deposit','withdraw')");
    }
};
