<?php
/**
 * Environment Configuration
 * Copy this file to env.php and fill in your values.
 * NEVER commit env.php to version control.
 */

return [
    // Database (Supabase or local)
    'DB_HOST'     => 'localhost',
    'DB_PORT'     => '5432',
    'DB_NAME'     => 'abancool',
    'DB_USER'     => 'postgres',
    'DB_PASSWORD' => '',

    // Supabase (for JWT verification)
    'SUPABASE_URL'        => 'https://kmlvoshucegiybipqpll.supabase.co',
    'SUPABASE_ANON_KEY'   => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'SUPABASE_JWT_SECRET' => '', // From Supabase Dashboard → Settings → API → JWT Secret

    // WHM / cPanel
    'WHM_HOST'  => 'server.abancool.com',
    'WHM_PORT'  => '2087',
    'WHM_TOKEN' => '',

    // DirectAdmin
    'DA_HOST'           => 'da.abancool.com',
    'DA_PORT'           => '2222',
    'DA_ADMIN_USER'     => 'admin',
    'DA_ADMIN_PASSWORD' => '',
    'DA_API_KEY'        => '',

    // WHMCS
    'WHMCS_URL'            => 'https://billing.abancool.com/includes/api.php',
    'WHMCS_API_IDENTIFIER' => '',
    'WHMCS_API_SECRET'     => '',

    // M-Pesa
    'MPESA_CONSUMER_KEY'    => '',
    'MPESA_CONSUMER_SECRET' => '',
    'MPESA_SHORTCODE'       => '174379',
    'MPESA_PASSKEY'         => '',
    'MPESA_CALLBACK_URL'    => 'https://api.abancool.com/api/payments/mpesa/callback',
    'MPESA_ENV'             => 'sandbox', // 'sandbox' or 'production'

    // Stripe
    'STRIPE_SECRET_KEY'     => '',
    'STRIPE_WEBHOOK_SECRET' => '',
];
