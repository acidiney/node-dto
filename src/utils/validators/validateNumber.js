/**
 *
 * @type {{validateNumber: ((function(*=): (boolean|number))|*)}}
 */
module.exports = {
    validateNumber: (value) => {
        const parsed = Number(value);

        if (isNaN(parsed)) return false;

        return parsed
    }
}