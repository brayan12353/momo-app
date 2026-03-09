import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import { useState } from 'react'

export default function Edit({ transaction, operators, transactionTypes }) {
    const { flash } = usePage().props

    const { data, setData, put, processing, errors } = useForm({
        customer_phone: transaction.customer_phone || '',
        transaction_type: transaction.transaction_type || '',
        operator_id: transaction.operator_id || '',
        amount: transaction.amount || '',
        commission: transaction.commission || '',
        photo: null,
    })

    const [confirmOpen, setConfirmOpen] = useState(false)

    const submit = () => {
        put(route('transactions.update', transaction.id), {
            onSuccess: () => {
                setConfirmOpen(false)
            },
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Edit Transaction" />

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Update Transaction
                </h1>

                {flash.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {flash.success}
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        setConfirmOpen(true)
                    }}
                    className="space-y-4"
                >
                    {/* Same Fields As Create */}

                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={data.customer_phone}
                        onChange={(e) =>
                            setData('customer_phone', e.target.value)
                        }
                    />

                    <select
                        className="w-full border rounded px-3 py-2"
                        value={data.transaction_type}
                        onChange={(e) =>
                            setData('transaction_type', e.target.value)
                        }
                    >
                        {transactionTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full border rounded px-3 py-2"
                        value={data.operator_id}
                        onChange={(e) =>
                            setData('operator_id', e.target.value)
                        }
                    >
                        {operators.map((op) => (
                            <option key={op.id} value={op.id}>
                                {op.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={data.amount}
                        onChange={(e) =>
                            setData('amount', e.target.value)
                        }
                    />

                    <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={data.commission}
                        onChange={(e) =>
                            setData('commission', e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-600 text-white py-2 rounded"
                    >
                        Update Transaction
                    </button>
                </form>
            </div>

            {/* CONFIRM MODAL */}
            {confirmOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="mb-4">
                            Confirm update?
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submit}
                                disabled={processing}
                                className="px-4 py-2 bg-yellow-600 text-white rounded"
                            >
                                Yes Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    )
}