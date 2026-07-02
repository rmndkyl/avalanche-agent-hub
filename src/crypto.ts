import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGO = 'aes-256-gcm';
const SALT_LEN = 16;
const IV_LEN = 12;

export interface EncryptedPayload {
  salt: string;   // hex
  iv: string;     // hex
  tag: string;    // hex
  data: string;   // hex
}

function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, 32, { N: 2 ** 15, r: 8, p: 1 });
}

export function encrypt(data: string, password: string): EncryptedPayload {
  const salt = randomBytes(SALT_LEN);
  const iv = randomBytes(IV_LEN);
  const key = deriveKey(password, salt);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted.toString('hex'),
  };
}

export function decrypt(payload: EncryptedPayload, password: string): string {
  const salt = Buffer.from(payload.salt, 'hex');
  const iv = Buffer.from(payload.iv, 'hex');
  const tag = Buffer.from(payload.tag, 'hex');
  const data = Buffer.from(payload.data, 'hex');
  const key = deriveKey(password, salt);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}
