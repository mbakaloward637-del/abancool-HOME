<?php
/**
 * Bootstrap — loads env, DB, and helper functions.
 */

// Load environment
$envFile = __DIR__ . '/env.php';
if (!file_exists($envFile)) {
    http_response_code(500);
    die(json_encode(['error' => 'Server configuration missing. Copy env.example.php to env.php']));
}
$ENV = require $envFile;

// Make env globally accessible
$GLOBALS['ENV'] = $ENV;

function env(string $key, $default = null) {
    return $GLOBALS['ENV'][$key] ?? $default;
}

// PDO database connection (lazy singleton)
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s',
            env('DB_HOST', 'localhost'),
            env('DB_PORT', '5432'),
            env('DB_NAME', 'abancool')
        );
        $pdo = new PDO($dsn, env('DB_USER'), env('DB_PASSWORD'), [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

// JSON request body
function jsonInput(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

// JSON response helper
function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Simple JWT decode (HS256, Supabase)
function decodeJWT(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
    if (!$payload) return null;

    // Verify with Supabase JWT secret
    $secret = env('SUPABASE_JWT_SECRET');
    if ($secret) {
        $headerPayload = $parts[0] . '.' . $parts[1];
        $expectedSig = rtrim(strtr(base64_encode(
            hash_hmac('sha256', $headerPayload, $secret, true)
        ), '+/', '-_'), '=');

        if (!hash_equals($expectedSig, $parts[2])) {
            return null; // Invalid signature
        }
    }

    // Check expiry
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

// Authenticate request — returns user_id or dies with 401
function authenticate(): string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        jsonResponse(['error' => 'Authorization header required'], 401);
    }

    $payload = decodeJWT($m[1]);
    if (!$payload || empty($payload['sub'])) {
        jsonResponse(['error' => 'Invalid or expired token'], 401);
    }

    return $payload['sub']; // Supabase user ID
}

// Autoload services
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/../services/' . $class . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});
