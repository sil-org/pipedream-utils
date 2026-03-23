/**
 * @typedef {Object} SftpConfig
 * @property {string} host
 * @property {string} username
 * @property {string} privateKey
 */
/**
 * @typedef {Object} SftpResponse
 * @property {string} message
 * @property {string} error
 * @property {boolean} successful
 */
/**
 * Moves a file by its path to a new destination on an SFTP host. Returns an error or success message.
 * @param {string} filePath - The path to the local file to upload
 * @param {string} dest - The path to the destination file on the remote server including the new name
 * @param {SftpConfig} sftpConfig - SFTP authentication details
 * @returns {Promise<SftpResponse>} - { message: string, error: string, successful: boolean }
 */
export function renameSftpFile(filePath: string, dest: string, sftpConfig: SftpConfig): Promise<SftpResponse>;
export type SftpConfig = {
    host: string;
    username: string;
    privateKey: string;
};
export type SftpResponse = {
    message: string;
    error: string;
    successful: boolean;
};
