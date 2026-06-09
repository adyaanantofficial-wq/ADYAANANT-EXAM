-- Create the exam_results table
CREATE TABLE exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    exam TEXT NOT NULL,
    state TEXT NOT NULL,
    subject TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct INTEGER NOT NULL,
    incorrect INTEGER NOT NULL,
    skipped INTEGER NOT NULL,
    score INTEGER NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (Submit exam)
CREATE POLICY "Allow public inserts" ON exam_results FOR INSERT WITH CHECK (true);

-- Policy: Allow anyone to read (For Leaderboard)
CREATE POLICY "Allow public read" ON exam_results FOR SELECT USING (true);

-- Create Indexes for faster Leaderboard querying
CREATE INDEX idx_exam_results_score ON exam_results(score DESC);
CREATE INDEX idx_exam_results_percentage ON exam_results(percentage DESC);