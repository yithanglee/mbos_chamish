CREATE TABLE IF NOT EXISTS storefront_design_revisions (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  css text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS storefront_design_publication (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  revision_id integer REFERENCES storefront_design_revisions(id)
);
