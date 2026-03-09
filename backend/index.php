<?php
/**
 * Abancool Technology — API Router
 * Routes all /api/* requests to the correct endpoint file.
 */

require_once __DIR__ . '/config/bootstrap.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');

// Remove base path if deployed in a subdirectory
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
if ($basePath && strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

$method = $_SERVER['REQUEST_METHOD'];

// CORS headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Route map
$routes = [
    'GET'  => [
        '/api/cpanel/sso'    => __DIR__ . '/api/cpanel/sso.php',
        '/api/cpanel/stats'  => __DIR__ . '/api/cpanel/stats.php',
        '/api/cpanel/status' => __DIR__ . '/api/cpanel/status.php',
    ],
    'POST' => [
        '/api/provisioning/provision'   => __DIR__ . '/api/provisioning/provision.php',
        '/api/payments/mpesa'           => __DIR__ . '/api/payments/mpesa-stk.php',
        '/api/payments/mpesa/callback'  => __DIR__ . '/api/payments/mpesa-callback.php',
        '/api/payments/stripe/intent'   => __DIR__ . '/api/payments/stripe-intent.php',
        '/api/payments/stripe/webhook'  => __DIR__ . '/api/payments/stripe-webhook.php',
        '/api/whmcs/sync'              => __DIR__ . '/api/whmcs/sync.php',
    ],
];

if (isset($routes[$method][$uri])) {
    require $routes[$method][$uri];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found', 'path' => $uri]);
}
