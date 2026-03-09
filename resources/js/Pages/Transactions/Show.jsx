import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function Show({ transaction }) {
    return (
        <AuthenticatedLayout>
            <Head title="Transaction Details" />

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Transaction Details
                </h1>

                <div className="space-y-3">
                    <Detail label="Customer Phone" value={transaction.customer_phone} />
                    <Detail label="Operator" value={transaction.operator?.name} />
                    <Detail label="Type" value={transaction.transaction_type} />
                    <Detail label="Amount" value={`${transaction.amount} XAF`} />
                    <Detail label="Commission" value={`${transaction.commission} XAF`} />
                    <Detail label="Status" value={transaction.status} />
                    <Detail label="Date" value={new Date(transaction.created_at).toLocaleString()} />
                </div>

                <Link
                    href={route('transactions.index')}
                    className="inline-block mt-6 px-4 py-2 bg-gray-600 text-white rounded"
                >
                    Back
                </Link>
            </div>
        </AuthenticatedLayout>
    )
}

function Detail({ label, value }) {
    return (
        <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">{label}</span>
            <span className="text-gray-800">{value}</span>
        </div>
    )
}