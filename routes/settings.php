<?php

use App\Http\Controllers\Settings\CommissionSettingsController;
use App\Http\Controllers\Settings\InvoiceSettingsController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    Route::get('settings/invoice', [InvoiceSettingsController::class, 'edit'])->name('invoice-settings.edit');
    Route::post('settings/invoice', [InvoiceSettingsController::class, 'update'])->name('invoice-settings.update');

    Route::get('settings/commission', [CommissionSettingsController::class, 'edit'])->name('commission-settings.edit');
    Route::post('settings/commission', [CommissionSettingsController::class, 'update'])->name('commission-settings.update');
});
