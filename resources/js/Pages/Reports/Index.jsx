import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage } from '@inertiajs/react'
import { Pie, Bar } from 'react-chartjs-2'

export default function Reports(){

    const { totals, operators } = usePage().props

    const depositWithdrawData = {
        labels: ['Deposits','Withdrawals'],
        datasets:[
            {
                data:[totals.deposit, totals.withdraw]
            }
        ]
    }

    const operatorData = {
        labels: operators.map(op => op.operator?.name),
        datasets:[
            {
                label:'Operator Transactions',
                data: operators.map(op => op.total)
            }
        ]
    }

    return(
        <AuthenticatedLayout>

            <Head title="Reports"/>

            <h1 className="text-2xl font-bold mb-6">
                📊 Financial Reports
            </h1>

            {/* KPI CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                <Card title="Total Transactions" value={totals.count}/>
                <Card title="Total Amount" value={`${totals.amount} XAF`}/>
                <Card title="Total Deposits" value={`${totals.deposit} XAF`}/>
                <Card title="Total Withdrawals" value={`${totals.withdraw} XAF`}/>
                <Card title="Total Commission" value={`${totals.commission} XAF`}/>

            </div>

            {/* CHARTS */}

            <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-4">
                        Deposit vs Withdraw
                    </h2>
                    <Pie data={depositWithdrawData}/>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-4">
                        Operator Usage
                    </h2>
                    <Bar data={operatorData}/>
                </div>

            </div>

        </AuthenticatedLayout>
    )
}

function Card({title,value}){
    return(
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    )
}