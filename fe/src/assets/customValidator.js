import { helpers } from "@vuelidate/validators";

/**
 * Validasi array wajib diisi jika flag aktif.
 * @param {() => boolean} flagGetter
 * @param {string} message
 */
const requiredArrayIf = (flagGetter, message) =>
  helpers.withMessage(message, (value) => {
    if (!flagGetter()) return true;
    return Array.isArray(value) && value.length > 0;
  });

const requiredIf = (flagGetter, message) =>
  helpers.withMessage(message, (value) => {
    if (!flagGetter()) return true;
    return value != 0 && value != "";
  });

export { requiredArrayIf, requiredIf };
