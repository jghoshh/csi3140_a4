<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use FastRoute\RouteCollector;
use App\Controllers\PatientController;
use App\Controllers\AdminController;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..', 'backend.env');
$dotenv->load();

// Configure environment variables if they were not set
if (!getenv('admin_user')) {
    putenv("admin_user=admin");
}
if (!getenv('admin_pass')) {
    putenv("admin_pass=adminCSI3140");
}

// Configure error logging
ini_set('log_errors', 1);
ini_set('error_log', 'php://stdout');
error_reporting(E_ALL);

// Set up CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Setup route dispatcher
$dispatcher = FastRoute\simpleDispatcher(function(RouteCollector $r) {
    $r->addRoute('POST', '/api/patients', [PatientController::class, 'register']);
    $r->addRoute('GET', '/api/patients/{code}', [PatientController::class, 'getWaitTime']);
    $r->addRoute('GET', '/api/patients/info/{code}', [PatientController::class, 'getPatientInfo']);
    $r->addRoute('GET', '/api/admin/queues', [AdminController::class, 'getQueues']);
    $r->addRoute('PUT', '/api/admin/patients/{code}', [AdminController::class, 'updatePatientStatus']);
    $r->addRoute('PUT', '/api/admin/wait-times', [AdminController::class, 'updateWaitTimes']);
});

// Route the request
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

try {
  $routeInfo = $dispatcher->dispatch($httpMethod, $uri);
  switch ($routeInfo[0]) {
      case FastRoute\Dispatcher::NOT_FOUND:
          http_response_code(404);
          echo json_encode(['error' => 'Not Found']);
          break;
      case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
          http_response_code(405);
          echo json_encode(['error' => 'Method Not Allowed']);
          break;
      case FastRoute\Dispatcher::FOUND:
          $handler = $routeInfo[1];
          $vars = $routeInfo[2];
          call_user_func_array($handler, $vars);
          break;
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]);
}