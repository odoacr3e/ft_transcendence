ALTER TABLE users
ALTER COLUMN preferences TYPE jsonb,
ALTER COLUMN preferences SET DEFAULT '{
  "theme": "light",
  "colors": {
    "primary": "#420404",
    "secondary": "#06b6d4",
    "background": "#F2F3F4",
    "text": "#6b1b1b"
  }
}',
ALTER COLUMN preferences SET NOT NULL;