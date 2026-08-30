-- Add engineering/service fields to employees table
-- Run this migration to add schedule and appointment-related fields

-- Add role field
ALTER TABLE employees ADD COLUMN IF NOT EXISTS role VARCHAR(100) NULL;
COMMENT ON COLUMN employees.role IS 'Engineer, Service Advisor, Technician, etc.';

-- Add specialization field
ALTER TABLE employees ADD COLUMN IF NOT EXISTS specialization VARCHAR(200) NULL;
COMMENT ON COLUMN employees.specialization IS 'e.g., Engine Specialist, Brake Expert, etc.';

-- Add working_hours field
ALTER TABLE employees ADD COLUMN IF NOT EXISTS working_hours INTEGER DEFAULT 8;
COMMENT ON COLUMN employees.working_hours IS 'Working hours per day';

-- Add hourly_rate field
ALTER TABLE employees ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2) DEFAULT 0;
COMMENT ON COLUMN employees.hourly_rate IS 'Hourly rate for billing';

-- Add slot_duration field
ALTER TABLE employees ADD COLUMN IF NOT EXISTS slot_duration INTEGER DEFAULT 15;
COMMENT ON COLUMN employees.slot_duration IS 'Appointment slot duration in minutes';

-- Add schedule field (JSON)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": null, "saturday": {"start": "09:00", "end": "15:00"}, "sunday": null}'::jsonb;
COMMENT ON COLUMN employees.schedule IS 'Weekly work schedule';

-- Add available field
ALTER TABLE employees ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;
COMMENT ON COLUMN employees.available IS 'Available for appointments';

-- Update existing employees to have default schedule
UPDATE employees 
SET schedule = '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": null, "saturday": {"start": "09:00", "end": "15:00"}, "sunday": null}'::jsonb
WHERE schedule IS NULL;

-- Set available to true for active employees
UPDATE employees 
SET available = true
WHERE status = 'active' AND available IS NULL;
