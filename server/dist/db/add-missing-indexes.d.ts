/**
 * Add missing database indexes to fix slow queries (100-740ms)
 *
 * Problem: All queries are slow because there are no indexes on frequently queried columns
 * Solution: Add indexes on foreign keys and commonly filtered columns
 */
declare function addMissingIndexes(): Promise<void>;
export { addMissingIndexes };
//# sourceMappingURL=add-missing-indexes.d.ts.map