// Issue: unused variable
const HELPER_VERSION = "1.0.0";

// Issue: unused function
function unusedHelper() {
  return "not used";
}

// Issue: any type
export function formatData(data: any): string {
  // Issue: console.log
  console.log("Formatting data:", data);

  // Issue: var usage
  var result = JSON.stringify(data);

  // Issue: unused expression
  data.toString();

  return result;
}

// Issue: unused parameter
export function calculateTotal(items: any[], tax: number): number {
  // Issue: unused variable
  let unusedSum = 0;

  // Issue: var usage
  var total = items.reduce((sum, item) => sum + item.price, 0);

  return total;
}
