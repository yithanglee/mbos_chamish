CREATE TABLE IF NOT EXISTS homepage_revisions (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  html text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS homepage_publication (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  revision_id integer REFERENCES homepage_revisions(id)
);
