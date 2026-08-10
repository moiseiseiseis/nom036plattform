import "server-only";
import postgres from "postgres";

declare global {
  var __nom036Sql: ReturnType<typeof postgres> | undefined;
}

// El pooler de Supabase corre en modo transacción (puerto 6543), que no
// soporta prepared statements — hay que desactivarlos explícitamente.
export const sql =
  globalThis.__nom036Sql ??
  postgres(process.env.DATABASE_URL!, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalThis.__nom036Sql = sql;
}
