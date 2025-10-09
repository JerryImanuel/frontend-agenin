const Dashboard = () => {
  return (
    <div className="bg-gradient-background w-screen h-screen">
      <div className="px-10 py-7">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">Beranda</h1>
          <div className="w-12 h-12 rounded-full bg-blue-light flex items-center justify-center font-semibold">
            R
          </div>
        </div>

        <div className="flex flex-row items-center justify-between mt-8 gap-5">
          <div className="w-full">
            <p className="font-medium mb-3">Informasi Saldo</p>
            <div className="card bg-gradient-saldo text-white py-8 px-10 rounded-4xl shadow w-full cursor-pointer">
              <p className="mb-2 font-light">Total Saldo</p>
              <h1 className="font-bold text-2xl">Rp180.000.000</h1>
            </div>
          </div>
          <div className="w-full">
            <p className="font-medium mb-3">Kode Referral</p>
            <div className="card bg-gradient-referral text-primary py-8 px-10 rounded-4xl shadow cursor-pointer">
              <div className="flex flex-row items-start justify-between">
                <div>
                  <p className="mb-2 font-light">Referral Downline</p>
                  <h1 className="font-bold text-2xl">AWH1P233112</h1>
                </div>
                <div>
                  <i className="bx bx-copy text-2xl text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
