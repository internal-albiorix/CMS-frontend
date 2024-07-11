import CryptoJS from "crypto-js";
const salt = "ABCDEFGHI123456";
export const setSecureLocalStorage = (key: any, data: any) => {
  localStorage.setItem(key, CryptoJS.AES.encrypt(data, salt).toString());
};

export const getSecureLocalStorage = (key: any) => {
  try {
    const cypherText = localStorage.getItem(key) || "";
    const decrypted = CryptoJS.AES.decrypt(cypherText, salt).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  } catch (err) {
    return null;
  }
};
