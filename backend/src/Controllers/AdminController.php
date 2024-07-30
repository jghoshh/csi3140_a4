<?php
namespace App\Controllers;

use App\Services\DatabaseService;

// Class defines the actions performed by and exposed for admins
class AdminController
{
  private static function getDb()
  {
    return DatabaseService::getInstance()->getConnection();
  }

  private static function authenticateAdmin()
  {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
      http_response_code(401);
      echo json_encode(['error' => 'Authorization header missing']);
      return false;
    }

    $auth = $headers['Authorization'];

    if (strpos($auth, 'Basic ') !== 0) {
      http_response_code(401);
      echo json_encode(['error' => 'Invalid authentication method']);
      return false;
    }

    $encodedCredentials = substr($auth, 6);
    $decodedCredentials = base64_decode($encodedCredentials);
    $credentialParts = explode(':', $decodedCredentials);

    if (count($credentialParts) !== 2) {
      http_response_code(401);
      echo json_encode(['error' => 'Invalid authentication credentials']);
      return false;
    }

    $username = $credentialParts[0];
    $password = $credentialParts[1];
    $adminUser = getenv('admin_user');
    $adminPass = getenv('admin_pass');

    if ($username !== $adminUser || $password !== $adminPass) {
      http_response_code(401);
      echo json_encode(['error' => 'Unauthorized. Invalid admin credentials.']);
      return false;
    }

    return true;
  }

  public static function getQueues()
  {

    if (!self::authenticateAdmin()) {
      return;
    }
    $db = self::getDb();

    $baseQuery = "
          SELECT code, name, severity, arrival_time, 
          estimated_wait_time, is_treated,
          EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - arrival_time))/60 AS minutes_in_queue
          FROM patients
          WHERE is_treated = false
      ";

    // Queue sorted by severity
    $severityQueue = $db->query($baseQuery . "
          ORDER BY 
              CASE severity
                  WHEN 'critical' THEN 1
                  WHEN 'high' THEN 2
                  WHEN 'medium' THEN 3
                  WHEN 'low' THEN 4
              END
      ")->fetchAll(\PDO::FETCH_ASSOC);

    // Queue sorted by wait time
    $waitTimeQueue = $db->query($baseQuery . "
          ORDER BY minutes_in_queue DESC
      ")->fetchAll(\PDO::FETCH_ASSOC);

    // Queue sorted by both severity and wait time
    $combinedQueue = $db->query($baseQuery . "
          ORDER BY 
              CASE severity
                  WHEN 'critical' THEN 1
                  WHEN 'high' THEN 2
                  WHEN 'medium' THEN 3
                  WHEN 'low' THEN 4
              END,
              minutes_in_queue DESC
      ")->fetchAll(\PDO::FETCH_ASSOC);

    if (!$severityQueue || !$waitTimeQueue || !$combinedQueue) {
      http_response_code(500);
      echo json_encode(['error' => 'Internal server error while querying the database']);
      return;
    }

    $result = [
      'severity_queue' => $severityQueue,
      'wait_time_queue' => $waitTimeQueue,
      'combined_queue' => $combinedQueue
    ];

    http_response_code(200);
    echo json_encode($result);
  }

  public static function updatePatientStatus($code)
  {

    if (!self::authenticateAdmin()) {
      return;
    }

    $db = self::getDb();
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid JSON input: ' . json_last_error_msg()]);
      return;
    }

    if (!isset($data['is_treated']) || !is_bool($data['is_treated'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid or missing is_treated status']);
      return;
    }

    $stmt = $db->prepare("UPDATE patients SET is_treated = ? WHERE code = ? RETURNING code, is_treated");
    if (!$stmt->execute([(int) $data['is_treated'], $code])) {
      http_response_code(500);
      echo json_encode(['error' => 'Failed to update patient status']);
      return;
    }

    $updatedPatient = $stmt->fetch(\PDO::FETCH_ASSOC);
    if (!$updatedPatient) {
      http_response_code(404);
      echo json_encode(['error' => 'No patient found with the provided code']);
      return;
    }

    http_response_code(200);
    echo json_encode([
      'message' => 'Patient status updated successfully',
      'patient' => [
        'code' => $updatedPatient['code'],
        'is_treated' => $updatedPatient['is_treated']
      ]
    ]);
  }

  public static function updateWaitTimes()
  {
    if (!self::authenticateAdmin()) {
      return;
    }

    $db = self::getDb();
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid JSON input: ' . json_last_error_msg()]);
      return;
    }

    $validSeverities = ['critical', 'high', 'medium', 'low'];
    $adjustments = [];

    foreach ($validSeverities as $severity) {
      $adjustments[$severity] = 0;
    }

    foreach ($validSeverities as $severity) {
      if (isset($data[$severity])) {
        if (!is_numeric($data[$severity])) {
          http_response_code(400);
          echo json_encode(['error' => "Invalid value for $severity: must be numeric"]);
          return;
        }
        $adjustments[$severity] = intval($data[$severity]);
      }
    }

    $allZero = true;
    foreach ($adjustments as $value) {
      if ($value !== 0) {
        $allZero = false;
        break;
      }
    }

    if ($allZero) {
      http_response_code(200);
      echo json_encode(['message' => 'No updates necessary as all adjustments are zero']);
      return;
    }

    $updateQuery = "
          UPDATE patients
          SET estimated_wait_time = estimated_wait_time +
              CASE severity
                  WHEN 'critical' THEN ?
                  WHEN 'high' THEN ?
                  WHEN 'medium' THEN ?
                  WHEN 'low' THEN ?
                  ELSE 0
              END
          WHERE is_treated = false";

    $stmt = $db->prepare($updateQuery);
    if (
      !$stmt->execute([
        $adjustments['critical'],
        $adjustments['high'],
        $adjustments['medium'],
        $adjustments['low']
      ])
    ) {
      http_response_code(500);
      echo json_encode(['error' => 'Failed to update wait times']);
      return;
    }

    $affectedRows = $stmt->rowCount();
    if ($affectedRows > 0) {
      http_response_code(200);
      echo json_encode(['message' => 'Wait times updated successfully']);
    } else {
      http_response_code(200);
      echo json_encode(['message' => 'No wait times needed updating']);
    }
  }

  public static function admitPatient($code)
  {
    if (!self::authenticateAdmin()) {
      return;
    }

    $db = self::getDb();

    $updateQuery = "DELETE FROM patients WHERE code = ?";

    $stmt = $db->prepare($updateQuery);
    if (!$stmt->execute([$code])) {
      http_response_code(500);
      echo json_encode(['error' => 'Failed to update patients']);
      return;
    }

    $affectedRows = $stmt->rowCount();
    if ($affectedRows > 0) {
      http_response_code(200);
      echo json_encode(['message' => 'Patient admitted successfully']);
    } else {
      http_response_code(200);
      echo json_encode(['message' => 'No changes made']);
    }
  }
}