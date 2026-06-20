'use server'

import { sql } from '@/lib/db'

export async function getHelpfulCount(): Promise<number> {
  try {
    const rows = (await sql`SELECT helpful_count FROM feedback WHERE id = 1`) as {
      helpful_count: number
    }[]
    return rows[0]?.helpful_count ?? 0
  } catch (error) {
    console.log('[v0] getHelpfulCount error:', (error as Error).message)
    return 0
  }
}

export async function recordHelpfulVote(): Promise<{ ok: boolean; count: number }> {
  try {
    const rows = (await sql`
      UPDATE feedback
      SET helpful_count = helpful_count + 1
      WHERE id = 1
      RETURNING helpful_count
    `) as { helpful_count: number }[]
    return { ok: true, count: rows[0]?.helpful_count ?? 0 }
  } catch (error) {
    console.log('[v0] recordHelpfulVote error:', (error as Error).message)
    return { ok: false, count: 0 }
  }
}
