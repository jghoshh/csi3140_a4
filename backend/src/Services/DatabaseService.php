<?php
namespace App\Services;

use PDO;
use PDOException;

// Class to encapsulate the database connection and operations
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
}