<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServiceController extends Controller
{
    //
    public function show($service)
    {
        return view('services.' . $service);
    }
}
