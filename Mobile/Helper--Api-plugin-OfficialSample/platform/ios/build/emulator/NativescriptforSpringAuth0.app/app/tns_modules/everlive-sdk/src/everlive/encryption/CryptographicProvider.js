import {CryptoJS} from 'node-cryptojs-aes';
const {AES} = CryptoJS;

export default class CryptographicProvider {
    constructor(options = {}) {
        this.options = options;
    }

    _getKey() {
        return this.options.encryption.key;
    }

    _canEncryptDecrypt(content) {
        return this._getKey() && content !== null && content !== undefined;
    }

    encrypt(content) {
        if (!this._canEncryptDecrypt(content)) {
            return content;
        }

        return AES.encrypt(content, this._getKey()).toString();
    }

    decrypt(content) {
        if (!this._canEncryptDecrypt(content)) {
            return content;
        }

        return AES.decrypt(content, this._getKey()).toString(CryptoJS.enc.Utf8);
    }
}