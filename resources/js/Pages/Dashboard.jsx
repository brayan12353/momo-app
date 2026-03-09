import React from 'react';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, transactions }) {
    const totalDeposits = transactions
        .filter(t => t.transaction_type === 'deposit')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalWithdraws = transactions
        .filter(t => t.transaction_type === 'withdraw')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Welcome, {auth.user.name}</h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-green-200 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Deposits</h2>
                        <p className="text-2xl">{totalDeposits} FCFA</p>
                    </div>
                    <div className="p-4 bg-red-200 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Withdrawals</h2>
                        <p className="text-2xl">{totalWithdraws} FCFA</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Operator</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td className="border px-4 py-2">{tx.transaction_type}</td>
                                    <td className="border px-4 py-2">{tx.operator.name}</td>
                                    <td className="border px-4 py-2">{tx.amount}</td>
                                    <td className="border px-4 py-2">{tx.status}</td>
                                    <td className="border px-4 py-2">{tx.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
