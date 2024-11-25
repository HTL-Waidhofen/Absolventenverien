TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`localhost` TRIGGER trg_update_versand_newsletter\nAFTER UPDATE ON t_absolvent\nFOR EACH ROW\nBEGIN\n    -- Überprüfe, ob das Attribut verstorben auf true gesetzt wurde\n    IF NEW.verstorben = TRUE AND OLD.verstorben = FALSE THEN\n        -- Aktualisiere das Attribut versand_newsletter in der Tabelle t_versand auf false\n        UPDATE t_versand\n        SET versand_newsletter = FALSE\n        WHERE FK_fortlaufendeNr = NEW.fortlaufendeNr;\n    END IF;\nEND'
sql_modes=1098907648
definers='root@localhost'
client_cs_names='utf8mb4'
connection_cl_names='utf8mb4_unicode_ci'
db_cl_names='utf8mb4_general_ci'
created=1732526872226551
