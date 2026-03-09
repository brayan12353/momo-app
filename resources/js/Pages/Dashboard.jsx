import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';

/* ---------- ChartJS Registration ---------- */
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
    const { transactions, customers, totalEarnings } = usePage().props;

    /* ---------- TRANSACTION TYPE COUNTS ---------- */
    const deposits = transactions.filter(t => t.transaction_type === 'deposit').length;
    const withdrawals = transactions.filter(t => t.transaction_type === 'withdraw').length;
    const transfers = transactions.filter(t => t.transaction_type === 'transfer').length;

    /* ---------- TOTAL COMMISSION ---------- */
    const totalCommission = transactions.reduce((sum, t) => sum + parseFloat(t.commission || 0), 0);

    /* ---------- EARNINGS PER OPERATOR ---------- */
    const operators = [...new Set(transactions.map(t => t.operator?.name))];
    const earningsPerOperator = operators.map(op => ({
        name: op,
        total: transactions
            .filter(t => t.operator?.name === op)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    }));

    /* ---------- PIE CHART (Transaction Types) ---------- */
    const pieData = {
        labels: ['Deposits', 'Withdrawals', 'Transfers'],
        datasets: [
            {
                data: [deposits, withdrawals, transfers],
                backgroundColor: ['#16a34a', '#dc2626', '#facc15'],
                hoverOffset: 10,
            },
        ],
    };

    /* ---------- BAR CHART (Monthly Earnings & Commission) ---------- */
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyEarnings = months.map((m, idx) => 
        transactions
            .filter(t => new Date(t.created_at).getMonth() === idx)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    );
    const monthlyCommission = months.map((m, idx) => 
        transactions
            .filter(t => new Date(t.created_at).getMonth() === idx)
            .reduce((sum, t) => sum + parseFloat(t.commission || 0), 0)
    );

    const barData = {
        labels: months,
        datasets: [
            { label: 'Usage Fee (FCFA)', data: monthlyEarnings, backgroundColor: '#2563eb' },
            { label: 'Commission (FCFA)', data: monthlyCommission, backgroundColor: '#f59e0b' },
        ],
    };

    /* ---------- RECENT TRANSACTIONS ---------- */
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    /* ---------- RECENT CUSTOMERS ---------- */
    const recentCustomers = [...customers]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* ---------- TOP SUMMARY CARDS ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                <StatCard value={transactions.length} label="Total Transactions" color="bg-blue-500" />
                <StatCard value={`${totalEarnings.toLocaleString()} FCFA`} label="Total Usage Fee" color="bg-green-500" />
                <StatCard value={`${totalCommission.toLocaleString()} FCFA`} label="Total Commission" color="bg-orange-500" />
                <StatCard value={deposits} label="Deposits" color="bg-teal-500" />
                <StatCard value={withdrawals} label="Withdrawals" color="bg-red-500" />
                <StatCard value={transfers} label="Transfers" color="bg-yellow-500" />
            </div>

            {/* ---------- CHARTS ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartBox title="Transaction Types">
                    <Pie data={pieData} />
                </ChartBox>
                <ChartBox title="Monthly Usage Fee & Commission">
                    <Bar data={barData} />
                </ChartBox>
            </div>

            {/* ---------- EARNINGS PER OPERATOR ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {earningsPerOperator.map(op => (
                    <StatCard
                        key={op.name}
                        value={`${op.total.toLocaleString()} FCFA`}
                        label={`Earnings (${op.name})`}
                        color="bg-purple-500"
                    />
                ))}
            </div>

            {/* ---------- RECENT TABLES ---------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Box title="Recent Transactions">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-4 py-2">Customer</th>
                                <th className="px-4 py-2">Operator</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Commission</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(tx => (
                                <tr key={tx.id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-2">{tx.customer_phone}</td>
                                    <td className="px-4 py-2">{tx.operator?.name ?? 'N/A'}</td>
                                    <td className="px-4 py-2">{tx.transaction_type}</td>
                                    <td className="px-4 py-2">{parseFloat(tx.amount).toLocaleString()}</td>
                                    <td className="px-4 py-2">{parseFloat(tx.commission || 0).toLocaleString()}</td>
                                    <td className="px-4 py-2">{new Date(tx.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </div>
        </AuthenticatedLayout>
    );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ value, label, color = 'bg-gray-500' }) {
    return (
        <div className={`${color} text-white p-6 rounded-xl shadow hover:shadow-lg transition`}>
            <h2 className="text-2xl font-bold">{value}</h2>
            <p className="text-white/80">{label}</p>
        </div>
    );
}

function ChartBox({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">{title}</h3>
            {children}
        </div>
    );
}

function Box({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow p-6 overflow-auto">
            <h3 className="font-semibold mb-4">{title}</h3>
            {children ?? (
                <div className="h-full flex items-center justify-center text-gray-400">
                    Content coming soon
                </div>
            )}
        </div>
    );
}
