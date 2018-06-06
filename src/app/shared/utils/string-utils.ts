const unescape = require('lodash/unescape');
const escape = require('lodash/escape');

/**
 * Helper utilities for string manipulation
 */
export class StringUtils {
  /**
   * Generate a random string of letters and numbers
   * @param length - The length of the string
   */
  static randomstring(length: number) {
    let s = '';
    const randomchar = () => {
      const n = Math.floor(Math.random() * 62);
      if (n < 10) {
        return n; // 1-10
      }
      if (n < 36) {
        return String.fromCharCode(n + 55); // A-Z
      }
      return String.fromCharCode(n + 61); // a-z
    };
    while (s.length < length) {
      s += randomchar();
    }
    return s;
  }

  /**
   * Obfuscate a string by encoding with base64
   * @param val A string to obfuscate
   */
  static obfuscateAdd(val: string) {
    if (val) {
      return window.btoa(unescape(encodeURIComponent(val.toString())));
    }
    return null;
  }

  /**
   * Remove the obfuscation of a string by decoding it from base64
   * @param val  A string to obfuscate
   */
  static obfuscateRemove(val: string) {
    if (val) {
      return decodeURIComponent(escape(window.atob(val)));
    }
    return null;
  }

  /**
   * Pad a string by adding random characters before or after the input
   * @param val Input string
   * @param before Number of characters to PREPEND to the string
   * @param after Number of characters to APPEND to the string
   */
  static pad(val: string, before?: number, after?: number) {
    let str = val;
    if (before) {
      str = this.randomstring(before) + str;
    }
    if (after) {
      str = str + this.randomstring(after);
    }
    return str;
  }

  /**
   * Remove a specific number of characters from the front or back of a strong
   * @param val Input string
   * @param before Number of characters to remove from the FRONT of a string
   * @param after Number of characters to remove from the Back of a string
   */
  static trim(val: string, before?: number, after?: number) {
    let str = val;
    if (before) {
      str = str.substring(before);
    }
    if (after) {
      str = str.substring(0, str.length - after);
    }
    return str;
  }
}
