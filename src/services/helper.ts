import * as crypto from 'crypto'
import { v1 as uuidv1 } from 'uuid'
import { genSalt, hash, compare } from 'bcrypt-nodejs'

/**
 *
 * - HelperService -
 *
 *Service for helper functions
 *
 */
export class HelperService {
  private readonly saltRounds: number = 10

  /**
   * hash plain password
   *
   * @param {string} plainPassword
   * @returns {Promise<string>}
   */
  public hashPassword(plainPassword): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(this.saltRounds, (err, salt) => {
        if (err) {
          reject(err)
        }

        hash(plainPassword, salt, null, (error, hashedVal) => {
          if (error) {
            reject(error)
          }

          resolve(hashedVal)
        })
      })
    })
  }

  /**
   * compares plain password with hashed password
   *
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  public verifyPassword(plainPassword, hashedPassword): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(plainPassword, hashedPassword, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  /**
   * hash string with sha256 algorithm - don't use for passwords
   *
   * @param {string} string
   * @returns {string}
   */
  public hashString(string: string): string {
    return crypto
      .createHash('sha256')
      .update(string)
      .digest('hex')
  }

  /**
   * generate uuid
   *
   * @returns {string}
   */
  public generateUuid(): string {
    return uuidv1()
  }
}