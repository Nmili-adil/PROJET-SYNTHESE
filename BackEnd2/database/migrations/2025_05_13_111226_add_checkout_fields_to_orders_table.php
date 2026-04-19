<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add billing and checkout fields if they don't exist
            if (!Schema::hasColumn('orders', 'billing_first_name')) {
                $table->string('billing_first_name')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_last_name')) {
                $table->string('billing_last_name')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_company')) {
                $table->string('billing_company')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_address')) {
                $table->string('billing_address')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_apartment')) {
                $table->string('billing_apartment')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_city')) {
                $table->string('billing_city')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_state')) {
                $table->string('billing_state')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_postcode')) {
                $table->string('billing_postcode')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_phone')) {
                $table->string('billing_phone')->nullable();
            }
            if (!Schema::hasColumn('orders', 'billing_email')) {
                $table->string('billing_email')->nullable();
            }
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->default('paypal');
            }
            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->default('pending');
            }
            if (!Schema::hasColumn('orders', 'notes')) {
                $table->text('notes')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'billing_first_name',
                'billing_last_name',
                'billing_company',
                'billing_address',
                'billing_apartment',
                'billing_city',
                'billing_state',
                'billing_postcode',
                'billing_phone',
                'billing_email',
                'payment_method',
                'payment_status',
                'notes'
            ]);
        });
    }
};