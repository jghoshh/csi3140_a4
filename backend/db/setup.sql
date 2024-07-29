-- Create the patients table
CREATE TABLE IF NOT EXISTS patients (
    code CHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    severity VARCHAR(8) CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
    arrival_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estimated_wait_time INTEGER NOT NULL,
    is_treated BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create an index on the code field for faster lookups
CREATE INDEX IF NOT EXISTS idx_patient_code ON patients(code);

-- Create an index on severity and arrival_time for efficient queue ordering
CREATE INDEX IF NOT EXISTS idx_severity_arrival ON patients(severity, arrival_time);

-- Create an index on the is_treated field for filtering untreated patients
CREATE INDEX idx_is_treated ON patients(is_treated);

-- Create a trigger function to generate a unique 3-letter code for each new patient
CREATE OR REPLACE FUNCTION generate_unique_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code CHAR(3);
    found_code CHAR(3);
    attempt_count INTEGER := 0; -- Counter for the number of attempts
    max_attempts INTEGER := 10; -- Maximum attempts to find a unique code
BEGIN
    LOOP
        -- Generate a random 3-letter code
        new_code := substring(md5(random()::text) from 1 for 3);

        -- Check if it already exists in the table
        SELECT code INTO found_code FROM patients WHERE code = new_code;

        -- Exit loop if not found
        IF found_code IS NULL THEN
            EXIT;
        END IF;

        -- Increment the attempt counter
        attempt_count := attempt_count + 1;

        -- Check if the maximum number of attempts has been reached
        IF attempt_count >= max_attempts THEN
            RAISE EXCEPTION 'Unable to generate a unique code after % attempts', max_attempts;
        END IF;
    END LOOP;

    -- Set the new code to the 'code' column of the current row being inserted
    NEW.code := new_code;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_patient
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_unique_code();

-- Fill patients table with default values
INSERT INTO patients
VALUES
(NULL, 'John Doe', 'high', CURRENT_TIMESTAMP, 5, FALSE), 
(NULL, 'Jane Dee', 'medium', CURRENT_TIMESTAMP, 17, FALSE), 
(NULL, 'Quandale Humphrey', 'low', CURRENT_TIMESTAMP, 32, FALSE)