
-- Add username column to existing profiles table
ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;

-- Add updated_at trigger for profiles table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create policy for username uniqueness check
CREATE POLICY "Users can check username availability" 
  ON public.profiles 
  FOR SELECT 
  USING (true);
