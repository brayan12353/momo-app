<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

/*
|--------------------------------------------------------------------------
| Dashboard (FIXED 🔐)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Customers
|--------------------------------------------------------------------------
*/

Route::get('/customers', function () {
    return inertia('Customers/Index');
})->name('customers.index');

Route::get('/customers/create', function () {
    return inertia('Customers/Create');
})->name('customers.create');

/*
|--------------------------------------------------------------------------
| Settings / Users / Reports
|--------------------------------------------------------------------------
*/

Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

Route::get('/settings', function () {
    return inertia('Settings/Index');
})->name('settings.index');

/*
|--------------------------------------------------------------------------
| Transactions
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // LIST
    Route::get('/transactions', [TransactionController::class, 'index'])
        ->name('transactions.index');

    // CREATE FORM
    Route::get('/transactions/create', [TransactionController::class, 'create'])
        ->name('transactions.create');

    // STORE
    Route::post('/transactions', [TransactionController::class, 'store'])
        ->name('transactions.store');

          // ✅ PDF ROUTE MUST BE HERE
    Route::get('/transactions/pdf', [TransactionController::class, 'exportPdf'])
        ->name('transactions.pdf');

    // SHOW (VIEW BUTTON)
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])
        ->name('transactions.show');

    // EDIT FORM
    Route::get('/transactions/{transaction}/edit', [TransactionController::class, 'edit'])
        ->name('transactions.edit');

    // UPDATE
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])
        ->name('transactions.update');

    // DELETE
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])
        ->name('transactions.destroy');
       


});



require __DIR__ . '/auth.php';
