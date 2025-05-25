<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | to instruct the browser how to handle cross-domain requests.
    |
    | For a detailed explanation, please see:
    | https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => [
        'api/*',             
        'sanctum/csrf-cookie', 
        'login',          
        'register',          
        'logout',           
        'user',             
    ],

    'allowed_methods' => ['*'], 
    'allowed_origins' => [
        'http://localhost:3000', 
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], 
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, 

];