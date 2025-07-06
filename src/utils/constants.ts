// Issue: unused export
export const UNUSED_CONSTANT = "not used anywhere";

export const API_BASE_URL = "https://api.example.com";

// Issue: unused variable
const INTERNAL_CONSTANT = "internal use only";

// Issue: var usage
var DEBUG_MODE = process.env.NODE_ENV === "development";

// Issue: console.log
console.log("Constants loaded");

export { DEBUG_MODE };
