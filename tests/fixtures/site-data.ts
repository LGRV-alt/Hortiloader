// Data to be inputted to the form
export const taskData = {
  name: "test",
  postcode: "g77 5us",
  orderNumber: "1234",
  orderType: "wholesale",
  orderDay: "wednesday",
};

// Updated data to check the tasks can be updated
export const updatedTaskData = {
  name: "test updated",
  postcode: "ka10 6un",
  orderNumber: "4321",
  orderType: "retail",
  orderDay: "friday",
};

// Protected routes
export const protectedURLRoutes = [
  "createCustomer",
  "collect",
  "holdingPage",
  "runs",
  "search",
  "settings",
];

// Unprotected Routes
export const unprotectedRoutes = [
  "terms",
  "privacy",
  "resend-verification",
  "forgot-password",
];
