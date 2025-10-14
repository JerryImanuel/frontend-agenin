import DownlineTable from "../../components/DownlineTable";

const Downline = () => {
  return (
    <div className="mt-2 px-5">
      <div className="card bg-white text-primary px-2 pb-4 pt-1 rounded-2xl shadow">
        <DownlineTable
          data={[
            {
              id: 1,
              name: "Budi Santoso",
              dateCreated: "2025-10-01",
            },
            {
              id: 2,
              name: "Siti Aisyah",
              dateCreated: "2025-09-28",
            },
            {
              id: 3,
              name: "Andi Pratama",
              dateCreated: "2025-09-30",
            },
            {
              id: 4,
              name: "Ahmad Bustomi",
              dateCreated: "2025-10-01",
            },
            {
              id: 5,
              name: "Tardi Manalu",
              dateCreated: "2025-10-02",
            },
            {
              id: 6,
              name: "David Corenswet",
              dateCreated: "2025-10-03",
            },
            {
              id: 7,
              name: "Andrew Garfield",
              dateCreated: "2025-10-04",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Downline;
