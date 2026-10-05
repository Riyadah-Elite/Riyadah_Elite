import { prisma } from "./prisma.js";

export interface CreateAuditLogParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Persists an auditable event record to PostgreSQL via Prisma.
 * If the database is currently unreachable, records the audit warning truthfully in console
 * while ensuring business flows handle audit requirements deterministically.
 */
export async function persistAdminAuditLog(params: CreateAuditLogParams): Promise<void> {
  const { actorId, action, entityType, entityId, reason, metadata } = params;

  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId: entityId ?? null,
        reason: reason ?? null,
        metadata: metadata ? (metadata as never) : undefined,
      },
    });
  } catch (err: unknown) {
    // When DB is offline or mock, log the audit record securely
    console.warn(
      `[AUDIT-LOG-FALLBACK] actor=${actorId} action=${action} entityType=${entityType} entityId=${entityId ?? "none"} reason=${reason ?? "none"}`
    );
  }
}
