<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        // Cameroon regions
        $cameroonRegions = [
            'Yaounde','Douala','Bafoussam','Garoua','Limbe','Buea',
            'Kribi','Bamenda','Bertoua','Maroua'
        ];

        // Validation
        $request->validate([
            'name' => ['required', 'string', 'max:255'], // Kiosk Name
            'kiosk_location' => ['required', 'string', Rule::in($cameroonRegions)],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:6'],
            'category' => ['required', Rule::in(['kiosk'])], // Only kiosk for now
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name, // Kiosk Name
            'location' => $request->kiosk_location,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'agent',
            'category' => $request->category,
            'balance' => 0.00,
        ]);

        event(new Registered($user));

        return redirect()->route('login')->with('status', 'Account created successfully. Please log in.');
    }
}
