<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('index');
});
Route::get('/services', function () {
    return view('services');
});

Route::get('/services/{service}', [\App\Http\Controllers\ServiceController::class, 'show']);

Route::get('/career', function () {
    return view('career');
});

Route::get('/trust', function () {
    return view('trust');
});

Route::get('/blog', function () {
    return view('blog');
});

Route::get('/contact', function () {
    return view('contact');
});

Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');
