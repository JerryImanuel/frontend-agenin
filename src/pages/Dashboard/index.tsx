import DownlineTable from "../../components/DownlineTable";
import DownlineStats from "../../components/DownlineStats";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Beranda</h1>
      </div>
      <div className="flex flex-row items-center justify-between mt-6 gap-5">
        <div className="w-full">
          <p className="font-medium mb-3">Informasi Saldo</p>
          <div className="card bg-gradient-saldo text-white py-5 px-7 rounded-3xl shadow w-full cursor-pointer">
            <p className="mb-1 font-light text-sm">Total Saldo</p>
            <h1 className="font-semibold text-xl">Rp180.000.000</h1>
          </div>
        </div>
        <div className="w-full">
          <p className="font-medium mb-3">Kode Referral</p>
          <div className="card bg-gray-200 text-primary py-5 px-7 rounded-3xl shadow cursor-pointer">
            <div className="flex flex-row items-center justify-between">
              <div>
                <p className="mb-1 font-light text-sm">Referral Downline</p>
                <h1 className="font-semibold text-xl">AWH1P233112</h1>
              </div>
              <div>
                <i className="bx bx-copy text-2xl text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between mt-7 gap-5">
        <div className="w-full">
          <div className="flex flex-row mb-3 w-full items-center justify-between">
            <p className="font-medium">Downline</p>
            <Link
              to="/downline"
              className="text-link flex flex-row items-center ml-3"
            >
              <span className="mr-2 text-sm font-normal">Lihat Detail</span>
              <i className="bx bx-link-external"></i>
            </Link>
          </div>
          <div className="card bg-white text-primary p-6 rounded-3xl shadow cursor-pointer">
            <DownlineStats />
            <DownlineTable
              data={[
                {
                  id: 1,
                  name: "Budi Santoso",
                  dateCreated: "2025-10-01",
                  status: "Jumlah",
                },
                {
                  id: 2,
                  name: "Siti Aisyah",
                  dateCreated: "2025-09-28",
                  status: "Persen",
                },
                {
                  id: 3,
                  name: "Andi Pratama",
                  dateCreated: "2025-09-30",
                  status: "Jumlah",
                },
                {
                  id: 4,
                  name: "Ahmad Bustomi",
                  dateCreated: "2025-10-1",
                  status: "Jumlah",
                },
                {
                  id: 5,
                  name: "Tardi Manalu",
                  dateCreated: "2025-10-2",
                  status: "Persen",
                },
                {
                  id: 6,
                  name: "David Corenswet",
                  dateCreated: "2025-10-3",
                  status: "Jumlah",
                },
                {
                  id: 7,
                  name: "Andrew Garfield",
                  dateCreated: "2025-10-4",
                  status: "Persen",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
