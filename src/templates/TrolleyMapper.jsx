/* eslint-disable react/prop-types */

export default function TrolleyMapper({ records, customerList }) {
  const selectedRecords = records.filter((item) =>
    customerList.includes(item.id)
  );
  console.log(selectedRecords);
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Selected Items:</h2>
      {selectedRecords.map((item) => (
        <div key={item.id} className="p-2 bg-green-100 rounded mb-1">
          {item.title}-{item.orderNumber}
        </div>
      ))}
    </div>
  );
}
