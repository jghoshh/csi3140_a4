<?php
namespace App\Services;

use PDO;
use PDOException;

// Class to encapsulate database operations
class DatabaseService
{
  private static $instance = null;
  private $connection;

  private function __construct()
  {
    $host = $_ENV['DB_HOST'];
    $port = $_ENV['DB_PORT'];
    $dbname = $_ENV['DB_NAME'];
    $user = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASSWORD'];

    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

    try {
      $this->connection = new PDO($dsn, $user, $password);
      $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
      error_log("Database connection successfully established to $dbname at $host.");

      $this->setupDatabase();

    } catch (PDOException $e) {
      throw new \Exception("Database connection failed: " . $e->getMessage());
    }
  }

  public static function getInstance()
  {
    if (self::$instance === null) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function getConnection()
  {
    return $this->connection;
  }
  private function setupDatabase()
  {
    error_log("Setting up database...");

    $setupQueries = [
      "CREATE TABLE IF NOT EXISTS patients (
                code CHAR(3) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                severity VARCHAR(8) CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
                arrival_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                estimated_wait_time INTEGER NOT NULL,
                is_treated BOOLEAN NOT NULL DEFAULT FALSE
            )",

      "CREATE INDEX IF NOT EXISTS idx_patient_code ON patients(code)",
      "CREATE INDEX IF NOT EXISTS idx_severity_arrival ON patients(severity, arrival_time)",
      "CREATE INDEX IF NOT EXISTS idx_is_treated ON patients(is_treated)",

      "CREATE OR REPLACE FUNCTION generate_unique_code()
            RETURNS TRIGGER AS $$
            DECLARE
                new_code CHAR(3);
                found_code CHAR(3);
                attempt_count INTEGER := 0;
                max_attempts INTEGER := 10;
            BEGIN
                LOOP
                    new_code := substring(md5(random()::text) from 1 for 3);
                    SELECT code INTO found_code FROM patients WHERE code = new_code;
                    IF found_code IS NULL THEN
                        EXIT;
                    END IF;
                    attempt_count := attempt_count + 1;
                    IF attempt_count >= max_attempts THEN
                        RAISE EXCEPTION 'Unable to generate a unique code after % attempts', max_attempts;
                    END IF;
                END LOOP;
                NEW.code := new_code;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql",

      "DROP TRIGGER IF EXISTS before_insert_patient ON patients",
      "CREATE TRIGGER before_insert_patient
            BEFORE INSERT ON patients
            FOR EACH ROW
            EXECUTE FUNCTION generate_unique_code()"
    ];

    foreach ($setupQueries as $query) {
      $this->connection->exec($query);
    }
  }
}