/**
 * Generic localStorage-backed "table" used by every database module.
 *
 * This stands in for an embedded SQLite table. Every function here maps
 * 1:1 to a SQL statement (getAll -> SELECT *, insert -> INSERT, update ->
 * UPDATE ... WHERE id, remove -> DELETE ... WHERE id), so migrating to a
 * real SQLite file later (e.g. via better-sqlite3 in Electron) only means
 * rewriting the bodies of these functions — nothing that calls a table
 * needs to change.
 */
export function createTable(storageKey) {
  const readAll = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(`[db] Failed to read table "${storageKey}"`, e);
      return [];
    }
  };

  const writeAll = (rows) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch (e) {
      console.error(`[db] Failed to write table "${storageKey}"`, e);
    }
  };

  return {
    key: storageKey,
    getAll: () => readAll(),
    findById: (id) => readAll().find((r) => r.id === id) || null,
    query: (predicate) => readAll().filter(predicate),
    insert: (row) => {
      const rows = readAll();
      rows.push(row);
      writeAll(rows);
      return row;
    },
    insertMany: (newRows) => {
      const rows = readAll();
      writeAll([...rows, ...newRows]);
      return newRows;
    },
    update: (id, patch) => {
      const rows = readAll();
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      rows[idx] = { ...rows[idx], ...patch };
      writeAll(rows);
      return rows[idx];
    },
    upsert: (row) => {
      const rows = readAll();
      const idx = rows.findIndex((r) => r.id === row.id);
      if (idx === -1) rows.push(row);
      else rows[idx] = row;
      writeAll(rows);
      return row;
    },
    remove: (id) => {
      const rows = readAll();
      writeAll(rows.filter((r) => r.id !== id));
    },
    replaceAll: (rows) => writeAll(rows),
    isEmpty: () => readAll().length === 0,
  };
}

// Single-object "table" for things like settings, where there's only ever one row.
export function createSingleton(storageKey, fallback) {
  return {
    get: () => {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        console.error(`[db] Failed to read singleton "${storageKey}"`, e);
        return fallback;
      }
    },
    set: (value) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch (e) {
        console.error(`[db] Failed to write singleton "${storageKey}"`, e);
      }
    },
  };
}
