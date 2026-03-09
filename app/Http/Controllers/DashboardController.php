<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\User;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 🔐 ONLY transactions created by THIS user
        $transactions = Transaction::with('operator')
            ->where('sender_id', $user->id) // ✅ FIXED
            ->get();

        // 🔐 ONLY customers created by THIS user (if applicable)
       $customers = collect(); // ✅ FIXED

        // Total earnings (user-specific)
        $totalEarnings = $transactions->sum('amount');

        return Inertia::render('Dashboard', [
            'transactions'  => $transactions,
            'customers'     => $customers,
            'totalEarnings' => $totalEarnings,
            'kioskName'     => $user->kiosk_name,
        ]);
    }
}
