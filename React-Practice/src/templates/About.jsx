/* eslint-disable react/prop-types */
import CreateHolding from "../Components/CreateHolding";

export default function About({ records }) {
  const holding = records.filter((record) => record.other == "holding");
  console.log(holding);

  return (
    <div>
      <CreateHolding></CreateHolding>

      {holding.map((record) => (
        <p key={record.id}>
          {record.title} - {record.orderInfo}
        </p>
      ))}
    </div>
  );
}
