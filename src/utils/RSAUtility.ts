import JSEncrypt from "jsencrypt";

// Utility to generate and manage RSA keys
export const RSAUtility = {
  generateKeyPair: () => {
    const crypt = new JSEncrypt({ default_key_size: "2048" });
    crypt.getKey();
    const publicKey = crypt.getPublicKey();
    const privateKey = crypt.getPrivateKey();

    // Save private key to local storage for later decryption
    localStorage.setItem("privateKey", privateKey);

    return publicKey;
  },

  encrypt: (data: string, publicKey: string) => {
    const crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey);

    const encrypted = crypt.encrypt(data);
    if (!encrypted) {
      throw new Error("Encryption failed.");
    }

    return encrypted;
  },

  decrypt: (encryptedData: string) => {
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
      throw new Error("Private key not found. Unable to decrypt.");
    }

    const crypt = new JSEncrypt();
    crypt.setPrivateKey(privateKey);

    const decrypted = crypt.decrypt(encryptedData);
    if (!decrypted) {
      throw new Error("Decryption failed.");
    }

    return decrypted;
  },
};
