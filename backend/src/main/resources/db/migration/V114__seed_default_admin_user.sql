-- ============================================================
-- V114: Seed default admin user for evaluation & demo
-- ============================================================

INSERT INTO app_users (user_id, display_name, role, locked)
VALUES ('88888888-8888-4888-8888-888888888888', 'Quản Trị Viên Vocam', 'ADMIN', FALSE)
ON CONFLICT (user_id) DO UPDATE
SET display_name = EXCLUDED.display_name, role = EXCLUDED.role, locked = EXCLUDED.locked;
