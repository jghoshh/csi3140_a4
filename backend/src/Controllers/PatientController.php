<?php
namespace App\Controllers;

use App\Services\DatabaseService;

// Class defines the actions performed by and exposed for a patient
class PatientController
{
  private static function getDb()
  {
    return DatabaseService::getInstance()->getConnection();
  }

  public static function register()
  {
    $db = self::getDb();
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      http_response_code(400);
      echo json_encode(['error' => 'Invalid JSON input: ' . json_last_error_msg()]);
      return;
    }

    if (!isset($data['name'], $data['severity'], $data['wait_time']) || !in_array($data['severity'], ['low', 'medium', 'high', 'critical'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing or invalid data']);
      return;
    }

    $stmt = $db->prepare("INSERT INTO patients (name, severity, estimated_wait_time) VALUES (?, ?, ?) RETURNING code");

    if (
      $stmt->execute([
        htmlspecialchars($data['name']),
        $data['severity'],
        $data['wait_time']
      ])
    ) {
      $generatedCode = $stmt->fetch(\PDO::FETCH_ASSOC)['code'];
      http_response_code(201);
      echo json_encode(['message' => 'Patient registered successfully', 'patient_code' => $generatedCode]);
    } else {
      $errorInfo = $stmt->errorInfo();
      if ($errorInfo[0] == '23505') {
        http_response_code(409);
        echo json_encode(['error' => 'Registration failed due to duplicate entry']);
      } else {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed', 'details' => $errorInfo[2]]);
      }
    }
  }

  public static function getWaitTime($code)
  {
    $db = self::getDb();
    $stmt = $db->prepare("SELECT estimated_wait_time FROM patients WHERE code = ?");

    if (!$stmt->execute([$code])) {
      http_response_code(500);
      echo json_encode(['error' => 'Internal server error while querying the database']);
      return;
    }

    $result = $stmt->fetch(\PDO::FETCH_ASSOC);
    if ($result) {
      http_response_code(200);
      echo json_encode(
        [
          'message' => 'Patient found',
          'wait_time' => $result['estimated_wait_time']
        ]
      );
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'No patient found with the provided code']);
    }
  }

  public static function getPatientInfo($code) {
    $db = self::getDb();
    $stmt = $db->prepare("SELECT * FROM patients WHERE code = ?");

    if (!$stmt->execute([$code])) {
      http_response_code(500);
      echo json_encode(['error' => 'Internal server error while querying the database']);
      return;
    }

    $result = $stmt->fetch(\PDO::FETCH_ASSOC);
    if ($result) {
      http_response_code(200);
      echo json_encode(
        [
          'message' => 'Patient found',
          'code' => $result['code'],
          'name' => $result['name'],
          'severity' => $result['severity'],
          'arrival_time' => $result['arrival_time'],
          'wait_time' => $result['estimated_wait_time'],
          'is_treated' => $result['is_treated']
        ]
      );
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'No patient found with the provided code']);
    }
  }
}