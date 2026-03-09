<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('operator')
            ->where('sender_id', Auth::id());

        $totals = [
            'count' => (clone $query)->count(),
            'amount' => (clone $query)->sum('amount'),
            'deposit' => (clone $query)
                ->where('transaction_type', 'deposit')
                ->sum('amount'),

            'withdraw' => (clone $query)
                ->where('transaction_type', 'withdraw')
                ->sum('amount'),

            'commission' => (clone $query)->sum('commission'),
        ];

        $operatorStats = Transaction::with('operator')
            ->selectRaw('operator_id, SUM(amount) as total')
            ->where('sender_id', Auth::id())
            ->groupBy('operator_id')
            ->get();

        return Inertia::render('Reports/Index', [
            'totals' => $totals,
            'operators' => $operatorStats,
        ]);
    }
}