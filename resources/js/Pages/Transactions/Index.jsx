import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, usePage, Link } from '@inertiajs/react'
import { useEffect } from 'react'
import {
    EyeIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline'

export default function Index({ transactions, filters, totals }) {
    const { operators } = usePage().props

    function filterChanged(key, value) {
        router.get(
            route('transactions.index'),
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        )
    }

    // Auto refresh
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['transactions', 'totals'] })
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    return (
        <AuthenticatedLayout>
            <Head title="Transactions" />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    💸 Transactions Overview
                </h1>

                <div className="flex flex-col sm:flex-row gap-3">
          <button
    onClick={() => {
        const params = new URLSearchParams(filters).toString();

        const url = route('transactions.pdf') +
            (params ? `?${params}` : '');

        window.open(url, '_blank');
    }}
    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
>
    📄 Export PDF
</button>

                    <Link
                        href={route('transactions.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center w-full sm:w-auto"
                    >
                        + Add Transaction
                    </Link>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Kpi title="Total Transactions" value={totals.count} />
                <Kpi title="Total Amount" value={`${totals.amount} XAF`} />
                <Kpi title="Deposits" value={`${totals.deposit} XAF`} />
                <Kpi title="Withdrawals" value={`${totals.withdraw} XAF`} />
            </div>

            {/* FILTERS */}
            <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                    className="border rounded-lg px-3 py-2 w-full"
                    value={filters.transaction_type || ''}
                    onChange={e => filterChanged('transaction_type', e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                    <option value="transfer">Transfer</option>
                </select>

                <select
                    className="border rounded-lg px-3 py-2 w-full"
                    value={filters.operator_id || ''}
                    onChange={e => filterChanged('operator_id', e.target.value)}
                >
                    <option value="">All Operators</option>
                    {operators.map(op => (
                        <option key={op.id} value={op.id}>
                            {op.name}
                        </option>
                    ))}
                </select>

                {/* <input
                    type="date"
                    className="border rounded-lg px-3 py-2 w-full"
                    value={filters.from_date || ''}
                    onChange={e => filterChanged('from_date', e.target.value)}
                /> */}

                <input
                    type="date"
                    className="border rounded-lg px-3 py-2 w-full"
                    value={filters.to_date || ''}
                    onChange={e => filterChanged('to_date', e.target.value)}
                />
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left whitespace-nowrap">Phone</th>
                            <th className="p-3 text-left whitespace-nowrap">Operator</th>
                            <th className="p-3 text-left whitespace-nowrap">Type</th>
                            <th className="p-3 text-left whitespace-nowrap">Amount</th>
                            <th className="p-3 text-left whitespace-nowrap">Date</th>
                            <th className="p-3 text-left whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.data.map(tx => (
                            <tr key={tx.id} className="border-t hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap">
                                    {tx.customer_phone}
                                </td>

                                <td className="p-3 font-semibold whitespace-nowrap">
                                    {tx.operator?.name}
                                </td>

                                <td className="p-3 capitalize whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${
                                            tx.transaction_type === 'deposit'
                                                ? 'bg-green-100 text-green-700'
                                                : tx.transaction_type === 'withdraw'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}
                                    >
                                        {tx.transaction_type}
                                    </span>
                                </td>

                                <td className="p-3 font-bold whitespace-nowrap">
                                    {tx.amount} XAF
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                    {new Date(tx.created_at).toLocaleString()}
                                </td>

                                {/* ACTIONS */}
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-2">

                                        <Link
                                            href={route('transactions.show', tx.id)}
                                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>

                                        <Link
                                            href={route('transactions.edit', tx.id)}
                                            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </Link>

                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this transaction?')) {
                                                    router.delete(route('transactions.destroy', tx.id))
                                                }
                                            }}
                                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}

                        {transactions.data.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {transactions.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || ''}
                        preserveScroll
                        className={`px-3 py-2 rounded text-sm ${
                            link.active
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>

        </AuthenticatedLayout>
    )
}

/* KPI CARD */
function Kpi({ title, value }) {
    return (
        <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    )
}