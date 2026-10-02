import "./env";
import { lt } from "drizzle-orm";
import { createDb } from "../lib/db/client";
import { enquiries } from "../lib/db/schema";

/** Deletes enquiries older than the retention period stated in the privacy policy (24 months). Run monthly. */
const MONTHS = Number(process.env.ENQUIRY_RETENTION_MONTHS ?? 24);

async function main() {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - MONTHS);
  const { db, close } = await createDb();
  const deleted = await db.delete(enquiries).where(lt(enquiries.createdAt, cutoff)).returning({ id: enquiries.id });
  console.log(`Deleted ${deleted.length} enquiries created before ${cutoff.toISOString().slice(0, 10)}.`);
  await close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
