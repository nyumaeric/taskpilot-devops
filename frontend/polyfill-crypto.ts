// polyfill-crypto.ts
import { Crypto } from "node-webcrypto-ossl";

if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = new Crypto();
}
