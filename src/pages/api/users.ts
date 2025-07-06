import { NextApiRequest, NextApiResponse } from "next";

// Issue: unused variable
const API_VERSION = "v1";

// Issue: any type
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Issue: unused variable
  const unusedMethod = req.method;

  // Issue: console.log
  console.log("API users endpoint called");

  // Issue: var usage
  var responseData = {
    users: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ],
  };

  // Issue: unused expression
  req.headers;

  res.status(200).json(responseData);
}
