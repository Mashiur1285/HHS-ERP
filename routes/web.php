<?php

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('doctors', DoctorController::class);
    Route::resource('patients', PatientController::class);
    
    // Draft Routes
    Route::post('/patients/draft', [\App\Http\Controllers\DraftPatientController::class, 'store'])->name('draft-patients.store');
    Route::delete('/patients/draft/{draft}', [\App\Http\Controllers\DraftPatientController::class, 'destroy'])->name('draft-patients.destroy');

    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
});

require __DIR__.'/settings.php';
