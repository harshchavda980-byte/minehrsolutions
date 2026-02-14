<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #7b5cff; border-bottom: 2px solid #7b5cff; padding-bottom: 10px;">New Contact Submission</h2>
        <p><strong>Name:</strong> {{ $data['name'] }}</p>
        <p><strong>Email:</strong> {{ $data['email'] }}</p>
        <p><strong>Company:</strong> {{ $data['company'] ?? 'N/A' }}</p>
        <p><strong>Contact Number:</strong> {{ $data['contact_number'] }}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #7b5cff;">{{ $data['message'] }}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">This email was sent from the MineHR contact form.</p>
    </div>
</body>
</html>
