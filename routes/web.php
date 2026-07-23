<?php

use App\Http\Controllers\AgentController;
use App\Http\Controllers\AgentReportController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CollectPaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorCommissionReportController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Reports\PaymentReportController;
use App\Http\Controllers\Reports\SalesReportController;
use App\Http\Controllers\Reports\TestReportController;
use App\Http\Controllers\TestAdditionalItemController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('doctors', DoctorController::class);
    Route::resource('patients', PatientController::class);
    Route::resource('tests', TestController::class)->except(['show']);
    Route::resource('test-additional-items', TestAdditionalItemController::class)->except(['show']);

    // Agents
    Route::resource('agents', AgentController::class)->only(['index', 'store', 'update', 'destroy']);

    // Bills
    Route::get('/bills', [BillController::class, 'index'])->name('bills.index');
    Route::get('/bills/create', [BillController::class, 'create'])->name('bills.create');
    Route::post('/bills', [InvoiceController::class, 'store'])->name('bills.store');
    Route::get('/bills/{invoice}', [InvoiceController::class, 'bill'])->name('bills.show');
    Route::get('/bills/{invoice}/collect-payment', [CollectPaymentController::class, 'edit'])->name('bills.collect-payment');
    Route::put('/bills/{invoice}/collect-payment', [CollectPaymentController::class, 'update'])->name('bills.collect-payment.update');

    // Commission reports
    Route::get('/commissions/doctors', [DoctorCommissionReportController::class, 'index'])->name('commissions.doctors');
    Route::get('/commissions/doctors/{doctor}', [DoctorCommissionReportController::class, 'show'])->name('commissions.doctors.show');
    Route::get('/commissions/agents', [AgentReportController::class, 'index'])->name('commissions.agents');

    // Financial reports
    Route::get('/reports/sales', [SalesReportController::class, 'index'])->name('reports.sales');
    Route::get('/reports/payments', [PaymentReportController::class, 'index'])->name('reports.payments');
    Route::get('/reports/tests', [TestReportController::class, 'index'])->name('reports.tests');

    // Draft Routes
    Route::post('/patients/draft', [\App\Http\Controllers\DraftPatientController::class, 'store'])->name('draft-patients.store');
    Route::delete('/patients/draft/{draft}', [\App\Http\Controllers\DraftPatientController::class, 'destroy'])->name('draft-patients.destroy');

    // Invoice JSON + receipt
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::get('/invoices/{invoice}/receipt', [InvoiceController::class, 'receipt'])->name('invoices.receipt');
});

require __DIR__.'/settings.php';
