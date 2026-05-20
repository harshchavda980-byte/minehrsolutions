<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Contact;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:15',
            'message' => 'required|string',
        ]);

        // Save to database
        Contact::create($validatedData);

        // Send email notification
        Mail::to('info@minehrsolutions.com')->send(new ContactMail($validatedData));

        return back()->with('success', 'Your message has been sent successfully!');
    }
}
