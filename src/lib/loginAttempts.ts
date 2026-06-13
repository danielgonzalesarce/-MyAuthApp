import fs from "fs";
import path from "path";
import { getDataDir } from "@/lib/dataDir";

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
}

export const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const ATTEMPTS_FILE = path.join(getDataDir(), "login-attempts.json");

function ensureDataDir() {
  const dir = path.dirname(ATTEMPTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAttempts(): Record<string, AttemptRecord> {
  ensureDataDir();
  if (!fs.existsSync(ATTEMPTS_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(ATTEMPTS_FILE, "utf-8"));
}

function writeAttempts(data: Record<string, AttemptRecord>) {
  ensureDataDir();
  fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(data, null, 2));
}

function getRecord(email: string): AttemptRecord {
  const attempts = readAttempts();
  const record = attempts[email.toLowerCase()];

  if (!record) {
    return { count: 0, lockedUntil: null };
  }

  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    delete attempts[email.toLowerCase()];
    writeAttempts(attempts);
    return { count: 0, lockedUntil: null };
  }

  return record;
}

function saveRecord(email: string, record: AttemptRecord) {
  const attempts = readAttempts();
  attempts[email.toLowerCase()] = record;
  writeAttempts(attempts);
}

function deleteRecord(email: string) {
  const attempts = readAttempts();
  delete attempts[email.toLowerCase()];
  writeAttempts(attempts);
}

export function isLocked(email: string): boolean {
  const record = getRecord(email);
  return record.lockedUntil !== null && Date.now() < record.lockedUntil;
}

export function getLockMessage(email: string): string {
  const record = getRecord(email);
  if (!record.lockedUntil) {
    return "";
  }

  const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
  return `Cuenta bloqueada por ${MAX_ATTEMPTS} intentos fallidos. Intenta de nuevo en ${minutesLeft} minuto(s).`;
}

export function getAttemptsInfo(email: string) {
  const record = getRecord(email);
  const locked = isLocked(email);

  return {
    locked,
    attemptsUsed: record.count,
    attemptsLeft: locked ? 0 : Math.max(0, MAX_ATTEMPTS - record.count),
    maxAttempts: MAX_ATTEMPTS,
    lockMessage: locked ? getLockMessage(email) : "",
  };
}

export function recordFailedAttempt(email: string) {
  const record = getRecord(email);
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS;
  }

  saveRecord(email, record);

  return {
    locked: record.count >= MAX_ATTEMPTS,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - record.count),
    attemptsUsed: record.count,
  };
}

export function resetAttempts(email: string) {
  deleteRecord(email);
}
