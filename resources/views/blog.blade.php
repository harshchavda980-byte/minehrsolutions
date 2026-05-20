@extends('layouts.app')
@push('styles')
<link rel="stylesheet" href="{{ asset('css/blog.css') }}">
@endpush
@push('scripts')
<script src="{{ asset('js/blog.js') }}"></script>
@endpush
@section('content')
<section class="coming-soon-section">
    <h1 class="coming-soon-title">Blogs Coming Soon</h1>
    <p class="coming-soon-text">We are working on something amazing. Stay tuned!</p>
</section>
@endsection