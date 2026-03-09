import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ operators, transactionTypes }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_phone: '',
        transaction_type: '',
        operator_id: '',
        amount: '',
        commission: '',
        photo: null,
    });

    const [confirmOpen, setConfirmOpen] = useState(false);

    const submit = () => {
        post(route('transactions.store'), {
            onSuccess: () => {
                reset();
                setConfirmOpen(false);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Transaction" />

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Add New Transaction
                </h1>

                {/* SUCCESS MESSAGE */}
                {flash.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {flash.success}
                    </div>
                )}

                {/* FORM */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setConfirmOpen(true);
                    }}
                    className="space-y-4"
                >
                    {/* CUSTOMER PHONE */}
                    <div>
                        <label className="block font-medium">Customer Phone</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            value={data.customer_phone}
                            onChange={(e) =>
                                setData('customer_phone', e.target.value)
                            }
                        />
                        {errors.customer_phone && (
                            <p className="text-red-500 text-sm">
                                {errors.customer_phone}
                            </p>
                        )}
                    </div>

                    {/* TRANSACTION TYPE */}
                    <div>
                        <label className="block font-medium">
                            Transaction Type
                        </label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={data.transaction_type}
                            onChange={(e) =>
                                setData('transaction_type', e.target.value)
                            }
                        >
                            <option value="">Select type</option>
                            {transactionTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {errors.transaction_type && (
                            <p className="text-red-500 text-sm">
                                {errors.transaction_type}
                            </p>
                        )}
                    </div>

                    {/* OPERATOR */}
                    <div>
                        <label className="block font-medium">Operator</label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={data.operator_id}
                            onChange={(e) =>
                                setData('operator_id', e.target.value)
                            }
                        >
                            <option value="">Select operator</option>
                            {operators.map((op) => (
                                <option key={op.id} value={op.id}>
                                    {op.name}
                                </option>
                            ))}
                        </select>
                        {errors.operator_id && (
                            <p className="text-red-500 text-sm">
                                {errors.operator_id}
                            </p>
                        )}
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <label className="block font-medium">Amount</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            value={data.amount}
                            onChange={(e) =>
                                setData('amount', e.target.value)
                            }
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    {/* COMMISSION */}
                    <div>
                        <label className="block font-medium">
                            Commission
                        </label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            value={data.commission}
                            onChange={(e) =>
                                setData('commission', e.target.value)
                            }
                        />
                        {errors.commission && (
                            <p className="text-red-500 text-sm">
                                {errors.commission}
                            </p>
                        )}
                    </div>

                    {/* PHOTO */}
                    <div>
                        <label className="block font-medium">
                            Proof Image (optional)
                        </label>
                        <input
                            type="file"
                            className="w-full"
                            onChange={(e) =>
                                setData('photo', e.target.files[0])
                            }
                        />
                        {errors.photo && (
                            <p className="text-red-500 text-sm">
                                {errors.photo}
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Save Transaction
                    </button>
                </form>
            </div>

            {/* CONFIRMATION MODAL */}
            {confirmOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">
                            Confirm Transaction
                        </h2>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to save this transaction?
                            <br />
                            <strong>This action cannot be undone.</strong>
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submit}
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Yes, Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
