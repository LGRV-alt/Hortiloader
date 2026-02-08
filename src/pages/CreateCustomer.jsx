import { useState } from "react";
import { getDateWeek } from "../api/pocketbase";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../hooks/useTaskStore";
import pb from "../api/pbConnect";
import toast from "react-hot-toast";

export default function CreateCustomer() {
  const user = pb.authStore.record;
  const currentWeek = getDateWeek(new Date());
  const navigate = useNavigate();
  const createTask = useTaskStore((state) => state.createTask);
  const [saving, setSaving] = useState(false);

  // -----------Form Data-----------------------
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("monday");
  const [postcode, setPostcode] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [customerType, setCustomerType] = useState("wholesale");
  const [other, setOther] = useState("none");
  const [weekNumber, setWeekNumber] = useState(currentWeek);
  const [orderInfo, setOrderInfo] = useState("");
  const [year, setYear] = useState(2026);

  const handleSubmit = async () => {
    if (user.role === "viewer") {
      toast.error("Viewer cant create order");
      return;
    }

    if (!title) {
      toast.error("Order needs a customer name");
      return;
    }
    try {
      setSaving(true);
      await createTask({
        title,
        day,
        postcode,
        orderNumber,
        customerType,
        other,
        weekNumber,
        orderInfo,
        status: null,
        year,
        user: user.id,
        org: user.organization,
        created_by: user.id,
        updated_by: user.id,
      });
      setSaving(false);
      toast.success("Order Created");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to create task:", err);
      toast.error("Failed to create task. Please try again.");
    }
  };
  return (
    <div className="h-full w-full flex justify-center bg-slate-100 md:p-5 p-4">
      {/* <div className=" h-full w-1/2 p-4 rounded-3xl bg-[#F9FBFD] border-black border-2"> */}
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-white
  shadow-[0_20px_40px_rgba(15,23,42,0.12)]
  border border-slate-200 overflow-hidden"
      >
        <div
          className="absolute left-0 top-0 h-full w-4
  bg-gradient-to-b from-blue-500 to-blue-700"
        />
        <div className="flex flex-col h-full items-center justify-center md:justify-start relative px-12 py-10">
          <div className="flex-col  w-2/3 flex gap-2">
            <h2 className="text-2xl font-semibold text-slate-900 text-center">
              Create Order
            </h2>
            <div className="mx-auto h-px w-3/4 bg-blue-500/40" />
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Customer Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-300
  px-4 py-2.5 text-slate-900
  focus:outline-none focus:ring-2 focus:ring-blue-500
  focus:border-blue-500 transition"
            />
            {/* <input
              className=" bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400"
              type="text"
              placeholder="Customer Name"
              onChange={(e) => setTitle(e.target.value)}
              required
            /> */}
            <input
              className=" w-auto  bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400 "
              type="text"
              placeholder="Postcode"
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
            <input
              className=" w-auto bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400 "
              type="text"
              placeholder="Order No."
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />

            <select
              className=" bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400 "
              name="customerType"
              id="customerType"
              onChange={(e) => setCustomerType(e.target.value)}
            >
              <option value="" disabled>
                Customer Type
              </option>
              <option value="wholesale">Wholesale</option>
              <option value="retail">Retail</option>
              <option value="missed">Missed</option>
              <option value="other">Other</option>
            </select>

            <select
              className=" bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] "
              name="day"
              id="boardPage"
              onChange={(e) => setOther(e.target.value)}
            >
              <option value="" disabled>
                Type
              </option>
              <option value="none">Whiteboard</option>
              <option value="holding">Holding</option>
              <option value="collect">Collect</option>
            </select>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="text-center bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400 "
                name="day"
                id="day"
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="" disabled>
                  Day Required
                </option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>

              <input
                className="text-center w-auto bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400 "
                type="number"
                min={currentWeek}
                max={52}
                placeholder="Week"
                onChange={(e) => setWeekNumber(e.target.value)}
                required
              />
              <select
                className="text-center bg-transparent text-input text-lg border-b-2 focus:outline-none border-black focus:border-[#2563EB] placeholder:text-gray-400 "
                name="day"
                id="yearSelector"
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="" disabled>
                  Type
                </option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="0">2024</option>
              </select>
            </div>
          </div>
          <div className="h-full w-full p-2 flex flex-col items-center ">
            <h3 className="hidden md:block pb-2 text-lg font-medium">
              Additional Info
            </h3>
            <textarea
              className="rounded-3xl p-2 w-full h-1/2 text-center border-black bg-transparent text-lg border-2 focus:border-[#2563EB] placeholder:text-gray-400 "
              type="text"
              placeholder="Issues/Load information"
              onChange={(e) => setOrderInfo(e.target.value)}
              value={orderInfo}
              required
            />
            <button
              className="bg-[#2563EB] w-1/2 text-white py-2 px-4 rounded-md mt-4 transition-all border-black border-2 hover:bg-[#1f52c0]"
              onClick={handleSubmit}
              disabled={saving}
            >
              <div>
                <p> {saving ? "Saving..." : "Save"}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
