<?php

namespace App\Providers;

use Inertia\Inertia;
use App\Models\Operator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Inertia::share([
            'operators' => function () {
                // 🔐 Share ONLY when user is authenticated
                if (!Auth::check()) {
                    return [];
                }

                return Operator::select('id', 'name')->get();
            },
        ]);
    }
}
