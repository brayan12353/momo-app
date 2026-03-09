<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        // Basic validation
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', 'min:6'],
            'category' => ['required', Rule::in(['kiosk', 'supermarket'])],
        ]);

        $cameroonCities = [
            'yaounde','douala','bafoussam','garoua','limbe','buea',
            'kribi','bamenda','bertoua','maroua'
        ];

        $userData = [
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'agent',
            'category' => $request->category,
            'balance'  => 0,
        ];

        if ($request->category === 'kiosk') {
            $request->validate([
                'kiosk_name' => 'required|string|max:255',
                'kiosk_location' => 'required|string',
                'phone' => 'required|string|max:20',
            ]);

            if (!in_array(strtolower($request->kiosk_location), $cameroonCities)) {
                return back()->withErrors([
                    'kiosk_location' => 'Location must be a valid city in Cameroon.',
                ])->withInput();
            }

            $userData['name']     = $request->kiosk_name;
            $userData['location'] = $request->kiosk_location;
            $userData['phone']    = $request->phone;
        }

        if ($request->category === 'supermarket') {
            $request->validate([
                'supermarket_name' => 'required|string|max:255',
                'supermarket_location' => 'required|string',
            ]);

            if (!in_array(strtolower($request->supermarket_location), $cameroonCities)) {
                return back()->withErrors([
                    'supermarket_location' => 'Location must be a valid city in Cameroon.',
                ])->withInput();
            }

            $userData['name']     = $request->supermarket_name;
            $userData['location'] = $request->supermarket_location;
        }

        // Create user
        $user = User::create($userData);

        event(new Registered($user));

        // ❌ NO AUTO LOGIN
        // Auth::login($user);

        // ✅ Redirect to login with success message
        return redirect()->route('login')->with('status', 'Account created successfully. Please log in.');
    }
}
