<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Operator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class TransactionController extends Controller
{
    /**
     * List transactions (USER-SCOPED ✅)
     */
    public function index(Request $request)
    {
        $query = Transaction::with('operator')
            ->where('sender_id', Auth::id())
            ->orderBy('created_at', 'desc');

        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->filled('operator_id')) {
            $query->where('operator_id', $request->operator_id);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $totals = [
            'count'    => (clone $query)->count(),
            'amount'   => (clone $query)->sum('amount'),
            'deposit'  => (clone $query)->where('transaction_type', 'deposit')->sum('amount'),
            'withdraw' => (clone $query)->where('transaction_type', 'withdraw')->sum('amount'),
        ];

        return Inertia::render('Transactions/Index', [
            'transactions' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only([
                'transaction_type',
                'operator_id',
                'from_date',
                'to_date',
            ]),
            'totals' => $totals,
        ]);
    }

    /**
     * Show single transaction (USER-SCOPED ✅)
     */
    public function show(Transaction $transaction)
    {
        if ($transaction->sender_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction->load('operator'),
        ]);
    }

    /**
     * Show edit form (USER-SCOPED ✅)
     */
    public function edit(Transaction $transaction)
    {
        if ($transaction->sender_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'operators' => Operator::select('id', 'name')->get(),
            'transactionTypes' => ['deposit', 'withdraw', 'transfer'],
        ]);
    }

    /**
     * Update transaction (USER-SCOPED ✅)
     */
    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->sender_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'customer_phone'   => ['required', 'string', 'max:20'],
            'transaction_type' => ['required', 'in:deposit,withdraw,transfer'],
            'operator_id'      => ['required', 'exists:operators,id'],
            'amount'           => ['required', 'numeric', 'min:1'],
            'commission'       => ['required', 'numeric', 'min:0'],
            'photo'            => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('photo')) {
            if ($transaction->photo) {
                Storage::disk('public')->delete($transaction->photo);
            }
            $transaction->photo = $request->file('photo')->store('transactions', 'public');
        }

        $transaction->update([
            'customer_phone'   => $request->customer_phone,
            'transaction_type' => $request->transaction_type,
            'operator_id'      => $request->operator_id,
            'amount'           => $request->amount,
            'commission'       => $request->commission,
        ]);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction updated successfully.');
    }

    /**
     * Delete transaction (USER-SCOPED ✅)
     */
    public function destroy(Transaction $transaction)
    {
        if ($transaction->sender_id !== Auth::id()) {
            abort(403);
        }

        if ($transaction->photo) {
            Storage::disk('public')->delete($transaction->photo);
        }

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction deleted successfully.');
    }

    /**
     * Show create transaction form
     */
    public function create()
    {
        return Inertia::render('Transactions/Create', [
            'operators' => Operator::select('id', 'name')->get(),
            'transactionTypes' => ['deposit', 'withdraw', 'transfer'],
        ]);
    }

    /**
     * Store transaction (already correct ✅)
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_phone'   => ['required', 'string', 'max:20'],
            'transaction_type' => ['required', 'in:deposit,withdraw,transfer'],
            'operator_id'      => ['required', 'exists:operators,id'],
            'amount'           => ['required', 'numeric', 'min:1'],
            'commission'       => ['required', 'numeric', 'min:0'],
            'photo'            => ['nullable', 'image', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('transactions', 'public');
        }

        Transaction::create([
            'sender_id'        => Auth::id(),
            'receiver_id'      => null,
            'operator_id'      => $request->operator_id,
            'transaction_type' => $request->transaction_type,
            'amount'           => $request->amount,
            'commission'       => $request->commission,
            'customer_phone'   => $request->customer_phone,
            'agent_phone'      => Auth::user()->phone ?? Auth::user()->email,
            'photo'            => $photoPath,
            'transaction_time' => now(),
            'status'           => 'completed',
        ]);

        return back()->with('success', 'Transaction saved successfully.');
    }

    /**
     * Export PDF (USER-SCOPED ✅)
     */
    public function exportPdf(Request $request)
    {
        $query = Transaction::with('operator')
            ->where('sender_id', Auth::id());

        if ($request->transaction_type) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->operator_id) {
            $query->where('operator_id', $request->operator_id);
        }

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transactions = $query->get();

        $pdf = Pdf::loadView('transactions.pdf', [
    'transactions' => $transactions,
]);

        return $pdf->download('transactions.pdf');
    }
}