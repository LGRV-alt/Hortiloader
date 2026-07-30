export const FIELD_LABELS = {
  title: "Customer Name",
  day: "Day",
  postcode: "Postcode",
  orderNumber: "Order Number",
  customerType: "Customer Type",
  other: "Board Type",
  weekNumber: "Week",
  orderInfo: "Order Info",
  status: "Status",
  year: "Year",
  trollies: "Trollies",
  extras: "Extras",
};

export const formatHistoryValue = (v) =>
  v === null || v === undefined || v === "" ? "—" : String(v);
