<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transactions Report</title>
    <style>
        body { font-family: DejaVu Sans; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px; }
        th { background: #f3f3f3; }
    </style>
</head>
<body>

<h2>Transactions Report</h2>

<table>
    <thead>
        <tr>
            <th>Phone</th>
            <th>Operator</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date & Time</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($transactions as $tx)
            <tr>
                <td>{{ $tx->customer_phone }}</td>
                <td>{{ $tx->operator?->name }}</td>
                <td>{{ ucfirst($tx->transaction_type) }}</td>
                <td>{{ $tx->amount }}</td>
                <td>{{ $tx->created_at }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>
