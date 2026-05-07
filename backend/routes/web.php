<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

// Route::get('/test-mail', function () {
//     Mail::raw('Hello Ayyoub 🔥', function ($message) {
//         $message->to('khouilidayoub4@gmail.com')
//                 ->subject('Test Laravel Mail');
//     });

//     return 'Mail sent!';
// });
Route::get('/', function () {
    return view('welcome');
});
