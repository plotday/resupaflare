import { PostgrestError } from "@supabase/supabase-js";

export function safeQuery<T>({
  data,
  error,
}: {
  data: T;
  error: PostgrestError | null;
}) {
  if (error) {
    console.error(error);
    const exception = new Error(error.message);
    throw exception;
  }
  return data;
}
