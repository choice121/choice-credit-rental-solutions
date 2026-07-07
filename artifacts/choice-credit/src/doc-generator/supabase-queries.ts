import { createClient } from "@supabase/supabase-js";
import type { RentalHistoryEntry, RentalHistoryInsert, GeneratedDocument } from "./types";

function getAdminClient() {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!url || !key) throw new Error("Supabase not configured");
  return createClient(url, key);
}

// ── Rental History ─────────────────────────────────────────

export async function fetchRentalHistory(clientId: string): Promise<RentalHistoryEntry[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("rental_history")
    .select("*")
    .eq("client_id", clientId)
    .order("move_in_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as RentalHistoryEntry[];
}

export async function insertRentalHistoryEntry(entry: RentalHistoryInsert): Promise<RentalHistoryEntry> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("rental_history")
    .insert(entry)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as RentalHistoryEntry;
}

export async function updateRentalHistoryEntry(
  id: string,
  entry: Partial<RentalHistoryInsert>
): Promise<RentalHistoryEntry> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("rental_history")
    .update(entry)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as RentalHistoryEntry;
}

export async function deleteRentalHistoryEntry(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("rental_history")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Generated Documents ────────────────────────────────────

export async function fetchGeneratedDocuments(clientId: string): Promise<GeneratedDocument[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("generated_documents")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as GeneratedDocument[];
}

export async function saveGeneratedDocument(doc: {
  client_id: string;
  document_type: string;
  document_name: string;
  data_snapshot?: Record<string, unknown>;
  created_by?: string;
}): Promise<GeneratedDocument> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("generated_documents")
    .insert(doc)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as GeneratedDocument;
}

export async function deleteGeneratedDocument(id: string): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("generated_documents")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Client list (for selector) ─────────────────────────────

export async function fetchClients(search = ""): Promise<{ id: string; name: string; email: string }[]> {
  const supabase = getAdminClient();
  let query = supabase
    .from("profiles")
    .select("id, name:full_name, email")
    .eq("role", "client")
    .order("full_name");

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query.limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; name: string; email: string }[];
}
