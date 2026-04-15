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
        Schema::table('demande_presses', function (Blueprint $table) {
            if (Schema::hasColumn('demande_presses', 'press_card_number')) {
                $table->dropColumn('press_card_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('demande_presses', function (Blueprint $table) {
            $table->string('press_card_number')->nullable();
        });
    }
};
