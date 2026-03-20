-- ==========================================
-- Tabla de jobs de importación
-- ==========================================

CREATE TABLE IF NOT EXISTS public.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  real_estate_id uuid NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
  
  -- Configuración del job
  table_name text NOT NULL CHECK (table_name IN ('properties', 'listings', 'real-estates')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Progreso
  total_rows integer NOT NULL DEFAULT 0,
  processed_rows integer NOT NULL DEFAULT 0,
  batch_size integer NOT NULL DEFAULT 100,
  
  -- Errores y resultados
  errors jsonb DEFAULT '[]'::jsonb,
  result_summary jsonb,
  file_url text,
  original_filename text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Índices para import_jobs
CREATE INDEX IF NOT EXISTS idx_import_jobs_user ON public.import_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_real_estate ON public.import_jobs(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created ON public.import_jobs(created_at DESC);

-- ==========================================
-- RLS Policies - Multi-tenant
-- ==========================================

ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- Solo usuarios de la misma inmobiliaria pueden ver sus jobs
CREATE POLICY "import_jobs: viewable by tenant"
  ON public.import_jobs FOR SELECT
  USING (
    real_estate_id IN (
      SELECT real_estate_id FROM public.real_estate_agents
      WHERE profile_id = auth.uid()
    )
  );

-- Solo el propio usuario puede crear jobs
CREATE POLICY "import_jobs: creatable by user"
  ON public.import_jobs FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    real_estate_id IN (
      SELECT real_estate_id FROM public.real_estate_agents
      WHERE profile_id = auth.uid()
    )
  );

-- Solo el propio usuario puede actualizar sus jobs
CREATE POLICY "import_jobs: updatable by owner"
  ON public.import_jobs FOR UPDATE
  USING (
    user_id = auth.uid() AND
    real_estate_id IN (
      SELECT real_estate_id FROM public.real_estate_agents
      WHERE profile_id = auth.uid()
    )
  );

-- Solo el propio usuario puede eliminar sus jobs
CREATE POLICY "import_jobs: deletable by owner"
  ON public.import_jobs FOR DELETE
  USING (
    user_id = auth.uid() AND
    real_estate_id IN (
      SELECT real_estate_id FROM public.real_estate_agents
      WHERE profile_id = auth.uid()
    )
  );

-- Permisos
GRANT ALL ON public.import_jobs TO authenticated;
GRANT ALL ON public.import_jobs TO service_role;

-- ==========================================
-- Trigger para updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_import_jobs_updated_at
  BEFORE UPDATE ON public.import_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- Bucket de storage para imports
-- ==========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('imports', 'imports', false, 10485760, ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'])
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para imports
CREATE POLICY "imports: upload for authenticated users"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'imports' AND auth.role() = 'authenticated');

CREATE POLICY "imports: view own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "imports: delete own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'imports' AND auth.uid()::text = (storage.foldername(name))[1]);
