CREATE TABLE IF NOT EXISTS events (
	id UUID PRIMARY KEY,
	event VARCHAR(100) NOT NULL,
	aggregate_id UUID NOT NULL,
	aggregate_type VARCHAR(100) NOT NULL,
	event_data JSONB,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX aggregate_id_idx ON events (aggregate_id);
CREATE INDEX event_data_gin_idx ON events USING gin (event_data);