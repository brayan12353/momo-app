<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transactions Report</title>
    <style>
        body { 
            font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
            font-size: 12px; 
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 5px;
        }
        h2 {
            text-align: center;
            font-size: 14px;
            margin-bottom: 20px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
        }
        th { 
            background-color: #0d6efd; 
            color: #ffffff; 
            font-weight: bold;
            padding: 6px 4px;
            border: 1px solid #000000;
        }
        td {
            padding: 6px 4px;
            border: 1px solid #000000;
        }
        tbody tr:nth-child(even) {
            background-color: #e9f2ff; /* light blue for even rows */
        }
        tfoot td {
            font-weight: bold;
            background-color: #0d6efd;
            color: #ffffff;
        }
        .deposit { background-color: #d4edda; }  /* greenish */
        .withdraw { background-color: #f8d7da; } /* reddish */
        .transfer { background-color: #fff3cd; } /* yellowish */
    </style>
</head>
<body>

    <h1>Mobile Money Transactions Report</h1>
    <h2>{{ now()->format('d/m/Y H:i') }}</h2>

    <table>
        <thead>
            <tr>
                <th>Customer Phone</th>
                <th>Operator</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date & Time</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalAmount = 0;
            @endphp
            @foreach ($transactions as $tx)
            <tr class="{{ $tx->transaction_type }}">
                <td>{{ $tx->customer_phone }}</td>
                <td>{{ $tx->operator->name ?? 'N/A' }}</td>
                <td>{{ ucfirst($tx->transaction_type) }}</td>
                <td>{{ number_format($tx->amount, 2) }}</td>
                <td>{{ $tx->created_at->format('d/m/Y H:i:s') }}</td>
            </tr>
            @php
                $totalAmount += $tx->amount;
            @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">Total</td>
                <td>{{ number_format($totalAmount, 2) }}</td>
                <td></td>
            </tr>
        </tfoot>
    </table>

</body>
</html>
