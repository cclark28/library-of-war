import { supabase } from './supabase';
import type { MapFilters, Soldier } from '@/types/soldier';

interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

/**
 * Fetch soldiers within the current map viewport using PostGIS ST_Within.
 * Never loads the full dataset client-side — always viewport-bound.
 */
export async function getSoldiersInViewport(
  bbox: BoundingBox,
  filters: MapFilters,
  limit = 500
): Promise<Soldier[]> {
  // Explicit columns — avoids fetching the PostGIS binary `location` geometry column
  const COLS = 'id,first_name,last_name,rank,branch,status,era,date_of_casualty,date_of_birth,age_at_casualty,hometown_city,hometown_state,battle_location,battle_lat,battle_lng,unit,service_number,photo_url,photo_credit,source_url,source_label,notes,created_at,updated_at';

  let query = supabase
    .from('soldiers')
    .select(COLS)
    .gte('battle_lng', bbox.minLng)
    .lte('battle_lng', bbox.maxLng)
    .gte('battle_lat', bbox.minLat)
    .lte('battle_lat', bbox.maxLat)
    .limit(limit);

  if (filters.era !== 'all') query = query.eq('era', filters.era);
  if (filters.branch !== 'all') query = query.eq('branch', filters.branch);
  if (filters.status !== 'all') query = query.eq('status', filters.status);
  if (filters.search.trim()) {
    query = query.or(
      `last_name.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,battle_location.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Soldier[];
}

/**
 * Fetch a single soldier by ID for the profile panel.
 */
export async function getSoldierById(id: string): Promise<Soldier | null> {
  const { data, error } = await supabase
    .from('soldiers')
    .select('id,first_name,last_name,rank,branch,status,era,date_of_casualty,date_of_birth,age_at_casualty,hometown_city,hometown_state,battle_location,battle_lat,battle_lng,unit,service_number,photo_url,photo_credit,source_url,source_label,notes,created_at,updated_at')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Soldier;
}

/**
 * "On This Day" — soldiers whose date_of_casualty matches today's month/day.
 */
export async function getOnThisDay(): Promise<Soldier[]> {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const { data, error } = await supabase
    .from('soldiers')
    .select('id,first_name,last_name,rank,branch,status,era,date_of_casualty,age_at_casualty,battle_location,battle_lat,battle_lng,unit')
    .like('date_of_casualty', `%-${mm}-${dd}`)
    .limit(20);

  if (error) return [];
  return data as Soldier[];
}
