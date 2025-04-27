"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Box,
  Users,
  Activity,
  MessageSquare,
  DollarSign,
  Settings,
  Bell,
  Calendar,
  Eye,
  Menu,
  X,
  Package,
  Edit,
  Trash,
} from "lucide-react"

export default function Template() {
  const [selectedRows, setSelectedRows] = useState([])
  const [activeTab, setActiveTab] = useState("SarPra")
  const [activeMenu, setActiveMenu] = useState("Dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [barangs, setBarangs] = useState([])
  const [mitras, setMitras] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [mitraPage, setMitraPage] = useState(1)
  const [mitraTotalPages, setMitraTotalPages] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isTransaksiModalOpen, setIsTransaksiModalOpen] = useState(false)
  const [isMitraModalOpen, setIsMitraModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    id_kategori: activeTab === "SarPra" ? 1 : activeTab === "BarBisKai" ? 2 : 3,
    nama_barang: "",
    satuan: "",
    stok_awal: "",
    stok_akhir: "",
    keterangan: "",
    expired_date: "",
    id_mitra: "", // Add id_mitra field
  })
  const [transaksiData, setTransaksiData] = useState({
    id_mitra: "",
    id_barang: "",
    jenis_transaksi: "KELUAR", // Default to "KELUAR" for borrowing
    jumlah: 1,
    tanggal_transaksi: new Date().toISOString().split("T")[0],
    return_date: "",
    keterangan: "",
  });
  const [mitraData, setMitraData] = useState({
    id_mitra: null,
    nama: "",
    no_hp: "",
    email: "",
    alamat: "",
    perusahaan: "",
    at: "",
  })
  const [selectedBarang, setSelectedBarang] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("All time")
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  const dateFilterRef = useRef(null)

  const statusColors = {
    Sent: "bg-green-100 text-green-800",
    Overdue: "bg-yellow-100 text-yellow-800",
    Pending: "bg-pink-100 text-pink-800",
  }

  const fetchBarangs = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://127.0.0.1:8000/api/barangs?page=${page}&per_page=5`)
      console.log("Barangs response:", response.data) // Debug log
      setBarangs(response.data.data || [])
      setCurrentPage(response.data.current_page || 1)
      setTotalPages(response.data.last_page || 1)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching barangs:", error)
      setBarangs([])
      setLoading(false)
    }
  }

  const fetchMitras = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://127.0.0.1:8000/api/mitras?page=${page}&per_page=5`)
      console.log("Mitras response:", response.data) // Debug log
      setMitras(response.data.data || [])
      setMitraPage(response.data.current_page || 1)
      setMitraTotalPages(response.data.last_page || 1)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching mitras:", error)
      setMitras([])
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch both barangs and mitras on initial load
    const fetchInitialData = async () => {
      await fetchBarangs(currentPage);
      await fetchMitras(mitraPage);
    };
  
    fetchInitialData();
  }, [currentPage, mitraPage, activeMenu]);

  // Close date filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target)) {
        setIsDateFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleSelectAll = (e, data) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id_barang || item.id_mitra))
    } else {
      setSelectedRows([])
    }
  }

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Add Barang Modal
  const openAddModal = () => {
    setFormData({
      id_kategori: activeTab === "SarPra" ? 1 : activeTab === "BarBisKai" ? 2 : 3,
      nama_barang: "",
      satuan: "",
      stok_awal: "",
      stok_akhir: "",
      keterangan: "",
      expired_date: "",
      id_mitra: "", // Reset id_mitra
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create the barang record
      const barangResponse = await axios.post("http://127.0.0.1:8000/api/barangs", formData);
      const newBarang = barangResponse.data.data; // Assuming the API returns the created barang with its ID
  
      // Step 2: Create a transaksi record to log the mitra association
      const transaksiPayload = {
        id_barang: newBarang.id_barang, // Use the ID of the newly created barang
        id_mitra: formData.id_mitra, // Selected mitra from the form
        jenis_transaksi: "MASUK", // Assuming this is an incoming item (adjust as needed)
        jumlah: formData.stok_akhir, // Use stok_akhir as the quantity
        tanggal_transaksi: new Date().toISOString().split("T")[0], // Current date
        return_date: formData.expired_date || null, // Use expired_date as return_date if applicable
        keterangan: formData.keterangan || "Added new item", // Use description or default
      };
  
      await axios.post("http://127.0.0.1:8000/api/transaksis", transaksiPayload);
  
      // Step 3: Close the modal and refresh the data
      closeAddModal();
      fetchBarangs(currentPage);
    } catch (error) {
      console.error("Error adding barang and transaksi:", error);
      alert("Failed to add data. Please try again.");
    }
  };

  // Transaksi Modal
  const openTransaksiModal = (barang) => {
    setSelectedBarang(barang);
    setTransaksiData({
      id_mitra: "",
      id_barang: barang.id_barang,
      jenis_transaksi: "KELUAR", // Default to "KELUAR" for borrowing
      jumlah: 1,
      tanggal_transaksi: new Date().toISOString().split("T")[0],
      return_date: "",
      keterangan: "",
    });
    setIsTransaksiModalOpen(true);
  };

  const closeTransaksiModal = () => {
    setIsTransaksiModalOpen(false)
    setSelectedBarang(null)
  }

  const handleTransaksiInputChange = (e) => {
    const { name, value } = e.target
    setTransaksiData({ ...transaksiData, [name]: value })
  }

  const handleTransaksiSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting transaksiData:", transaksiData); // Debug log
      await axios.post("http://127.0.0.1:8000/api/transaksis", transaksiData);
      closeTransaksiModal();
      fetchBarangs(currentPage);
    } catch (error) {
      console.error("Error adding transaksi:", error);
      // Display specific validation error if available
      const errorMessage = error.response?.data?.message || "Failed to add transaction. Please try again.";
      alert(errorMessage);
    }
  };

  // Mitra Modal
  const openMitraModal = (mitra = null) => {
    if (mitra) {
      setMitraData({
        id_mitra: mitra.id_mitra,
        nama: mitra.nama,
        no_hp: mitra.no_hp,
        email: mitra.email,
        alamat: mitra.alamat,
        perusahaan: mitra.perusahaan,
        at: mitra.at || "",
      })
    } else {
      setMitraData({
        id_mitra: null,
        nama: "",
        no_hp: "",
        email: "",
        alamat: "",
        perusahaan: "",
        at: "",
      })
    }
    setIsMitraModalOpen(true)
  }

  const closeMitraModal = () => {
    setIsMitraModalOpen(false)
    setMitraData({
      id_mitra: null,
      nama: "",
      no_hp: "",
      email: "",
      alamat: "",
      perusahaan: "",
      at: "",
    })
  }

  const handleMitraInputChange = (e) => {
    const { name, value } = e.target
    setMitraData({ ...mitraData, [name]: value })
  }

  const handleMitraSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mitraData.id_mitra) {
        await axios.put(`http://127.0.0.1:8000/api/mitras/${mitraData.id_mitra}`, mitraData)
      } else {
        await axios.post("http://127.0.0.1:8000/api/mitras", mitraData)
      }
      closeMitraModal()
      fetchMitras(mitraPage)
    } catch (error) {
      console.error("Error saving mitra:", error)
      alert(error.response?.data?.message || "Failed to save mitra. Please try again.")
    }
  }

  const handleDeleteMitra = async (id) => {
    if (window.confirm("Are you sure you want to delete this mitra?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/mitras/${id}`)
        fetchMitras(mitraPage)
      } catch (error) {
        console.error("Error deleting mitra:", error)
        alert("Failed to delete mitra. Please try again.")
      }
    }
  }

  const handlePageChange = (page, type = "barang") => {
    if (type === "barang" && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    } else if (type === "mitra" && page >= 1 && page <= mitraTotalPages) {
      setMitraPage(page)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter)
    setIsDateFilterOpen(false) // Close dropdown after selection
  }

  const toggleDateFilter = () => {
    setIsDateFilterOpen((prev) => !prev)
  }

  const filterData = (data, type) => {
    let filtered = [...data]

    // Apply search filter
    if (searchQuery) {
      if (type === "barang") {
        filtered = filtered.filter(item =>
          item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      } else if (type === "mitra") {
        filtered = filtered.filter(item =>
          item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.perusahaan?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    }

    // Apply date filter
    const now = new Date()
    if (dateFilter !== "All time") {
      let cutoffDate = new Date()
      if (dateFilter === "Last 7 days") {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (dateFilter === "Last 30 days") {
        cutoffDate.setDate(now.getDate() - 30)
      }

      filtered = filtered.filter(item => {
        const dateStr = type === "barang" ? item.expired_date : item.at
        if (!dateStr) return true // Include items with no date
        const date = new Date(dateStr)
        return !isNaN(date.getTime()) && date >= cutoffDate
      })
    }

    return filtered
  }

  const currentData = activeMenu === "Mitra"
    ? mitras
    : activeTab === "SarPra"
    ? barangs.filter(item => item.kategori?.nama_kategori === "Sarana Prasarana")
    : activeTab === "BarBisKai"
    ? barangs.filter(item => item.kategori?.nama_kategori === "Barang Habis Pakai")
    : barangs.filter(item => item.kategori?.nama_kategori === "Dapur Umum")

  const filteredData = filterData(
    currentData,
    activeMenu === "Mitra" ? "mitra" : "barang"
  )
  console.log("Current Data:", currentData) // Debug: See data before filtering
  console.log("Filtered Data:", filteredData) // Debug: See data after filtering

  const sectionTitle = activeMenu === "Mitra"
    ? "Mitra"
    : activeTab === "SarPra"
    ? "Sarana Prasarana"
    : activeTab === "BarBisKai"
    ? "Barang Habis Pakai"
    : "Dapur Umum"

  const getStatus = (stokAwal, stokAkhir) => {
    if (stokAwal === undefined || stokAkhir === undefined) return "Pending"
    if (stokAkhir === stokAwal) return "Sent"
    if (stokAkhir < stokAwal) return "Overdue"
    return "Pending"
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white border-b h-16 flex items-center px-6">
        <div className="flex items-center">
          <button className="md:hidden mr-4" onClick={toggleSidebar}>
            <Menu size={24} className="text-gray-500" />
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <span className="hidden md:inline">GudangPMI</span>
            <span className="md:hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17" fill="currentColor" />
                <path d="M2 12L12 17L22 12" fill="currentColor" />
              </svg>
            </span>
          </h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button className="p-1 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Calendar size={20} className="text-gray-500" />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/pmi.png?height=32&width=32" alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="text-sm font-medium hidden md:inline">Afifah Irbah</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:transform-none md:static md:block transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <img src="/pmi.png?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-medium">Afifah Irbah</h3>
                <p className="text-xs text-gray-500">ADMIN</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs font-medium text-gray-500 mb-4">MENU</p>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      activeMenu === "Dashboard" ? "bg-indigo-50 text-gray-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveMenu("Dashboard")
                      setActiveTab("SarPra")
                      setIsSidebarOpen(false)
                    }}
                  >
                    <Home size={18} className="mr-3 text-gray-500" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      activeMenu === "Mitra" ? "bg-indigo-50 text-gray-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveMenu("Mitra")
                      setIsSidebarOpen(false)
                    }}
                  >
                    <Box size={18} className="mr-3 text-gray-500" />
                    Mitra
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      activeMenu === "Clients" ? "bg-indigo-50 text-gray-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveMenu("Clients")
                      setIsSidebarOpen(false)
                    }}
                  >
                    <Users size={18} className="mr-3 text-gray-500" />
                    Clients
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs Navigation (only for Dashboard menu) */}
          {activeMenu === "Dashboard" && (
            <div className="bg-white border-b">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8 px-6 py-4">
                <button
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "SarPra" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("SarPra")}
                >
                  Sarana Prasarana
                </button>
                <button
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "BarBisKai" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("BarBisKai")}
                >
                  Barang Habis Pakai
                </button>
                <button
                  className={`pb-2 text-sm font-medium ${
                    activeTab === "DaMum" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("DaMum")}
                >
                  Dapur Umum
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="relative" ref={dateFilterRef}>
                <button
                  onClick={toggleDateFilter}
                  className="flex items-center space-x-2 border rounded-md px-3 py-2 bg-white"
                >
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm">{dateFilter}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {isDateFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleDateFilterChange("All time")}
                    >
                      All time
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleDateFilterChange("Last 7 days")}
                    >
                      Last 7 days
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleDateFilterChange("Last 30 days")}
                    >
                      Last 30 days
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Section */}
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium">{sectionTitle}</h2>
                {activeMenu === "Dashboard" && (
                  <button
                    onClick={openAddModal}
                    className="flex items-center space-x-1 px-3 py-2 border rounded-md bg-blue-600 text-white text-sm"
                  >
                    <Plus size={16} />
                    <span>Add Data</span>
                  </button>
                )}
                {activeMenu === "Mitra" && (
                  <button
                    onClick={() => openMitraModal()}
                    className="flex items-center space-x-1 px-3 py-2 border rounded-md bg-blue-600 text-white text-sm"
                  >
                    <Plus size={16} />
                    <span>Add Data</span>
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onChange={(e) => toggleSelectAll(e, filteredData)}
                          checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                        />
                      </th>
                      {activeMenu === "Mitra" ? (
                        <>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone Number</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              Date <ChevronDown size={16} className="ml-1" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={activeMenu === "Mitra" ? 9 : 7} className="px-4 py-4 text-center text-sm text-gray-500">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedRows.includes(item.id_barang || item.id_mitra)}
                              onChange={() => toggleSelectRow(item.id_barang || item.id_mitra)}
                            />
                          </td>
                          {activeMenu === "Mitra" ? (
                            <>
                              <td className="px-4 py-4 text-sm text-gray-500">{item.id_mitra}</td>
                              <td className="px-4 py-4 text-sm">{item.nama}</td>
                              <td className="px-4 py-4 text-sm">{item.no_hp}</td>
                              <td className="px-4 py-4 text-sm">{item.email}</td>
                              <td className="px-4 py-4 text-sm">{item.alamat}</td>
                              <td className="px-4 py-4 text-sm">{item.perusahaan}</td>
                              <td className="px-4 py-4 text-sm text-gray-500">{item.at || "N/A"}</td>
                              <td className="px-4 py-4 flex space-x-2">
                                <button
                                  onClick={() => openMitraModal(item)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMitra(item.id_mitra)}
                                  className="text-gray-400 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash size={18} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-4 text-sm text-gray-500">{item.id_barang}</td>
                              <td className="px-4 py-4 text-sm">{item.nama_barang}</td>
                              <td className="px-4 py-4 text-sm">{item.stok_akhir} {item.satuan}</td>
                              <td className="px-4 py-4 text-sm text-gray-500">{item.expired_date || "N/A"}</td>
                              <td className="px-4 py-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[getStatus(item.stok_awal, item.stok_akhir)]}`}>
                                  {getStatus(item.stok_awal, item.stok_akhir)}
                                </span>
                              </td>
                              <td className="px-4 py-4 flex space-x-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => openTransaksiModal(item)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Borrow/Request"
                                >
                                  <Package size={18} />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <ChevronDown size={18} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm text-gray-500 mb-4 md:mb-0">
                  Showing{" "}
                  {(activeMenu === "Mitra"
                    ? (mitraPage - 1) * 5 + 1
                    : (currentPage - 1) * 5 + 1)}{" "}
                  -{" "}
                  {(activeMenu === "Mitra"
                    ? (mitraPage - 1) * 5 + filteredData.length
                    : (currentPage - 1) * 5 + filteredData.length)}{" "}
                  of{" "}
                  {activeMenu === "Mitra"
                    ? mitras.length
                    : barangs.length}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      handlePageChange(
                        activeMenu === "Mitra"
                          ? mitraPage - 1
                          : currentPage - 1,
                        activeMenu === "Mitra"
                          ? "mitra"
                          : "barang"
                      )
                    }
                    disabled={
                      activeMenu === "Mitra"
                        ? mitraPage === 1
                        : currentPage === 1
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full border disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[
                    ...Array(
                      activeMenu === "Mitra"
                        ? mitraTotalPages
                        : totalPages
                    ),
                  ].map((_, index) => {
                    const page_ = index + 1
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handlePageChange(
                            index + 1,
                            activeMenu === "Mitra"
                              ? "mitra"
                              : "barang"
                          )
                        }
                        className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                          (activeMenu === "Mitra"
                            ? mitraPage
                            : currentPage) === index + 1
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                  <button
                    onClick={() =>
                      handlePageChange(
                        activeMenu === "Mitra"
                          ? mitraPage + 1
                          : currentPage + 1,
                        activeMenu === "Mitra"
                          ? "mitra"
                          : "barang"
                      )
                    }
                    disabled={
                      activeMenu === "Mitra"
                        ? mitraPage === mitraTotalPages
                        : currentPage === totalPages
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full border disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding Barang */}
      {isAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New Item</h2>
          <button onClick={closeAddModal}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleAddSubmit}>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={sectionTitle}
              disabled
              className="mt-1 block w-full border rounded-md p-2 bg-gray-100"
            />
            <input type="hidden" name="id_kategori" value={formData.id_kategori} />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Mitra</label>
            <select
              name="id_mitra"
              value={formData.id_mitra}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select Mitra</option>
              {mitras.map((mitra) => (
                <option key={mitra.id_mitra} value={mitra.id_mitra}>
                  {mitra.nama} ({mitra.perusahaan})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="nama_barang"
              value={formData.nama_barang}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              name="satuan"
              value={formData.satuan}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
            <input
              type="number"
              name="stok_awal"
              value={formData.stok_awal}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
              min="0"
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Final Stock</label>
            <input
              type="number"
              name="stok_akhir"
              value={formData.stok_akhir}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
              min="0"
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Expired Date</label>
            <input
              type="date"
              name="expired_date"
              value={formData.expired_date}
              onChange={handleAddInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      {/* Modal for Adding Transaksi */}
      {isTransaksiModalOpen && selectedBarang && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Borrow/Request Item</h2>
          <button onClick={closeTransaksiModal}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleTransaksiSubmit}>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={selectedBarang.nama_barang}
              disabled
              className="mt-1 block w-full border rounded-md p-2 bg-gray-100"
            />
            <input type="hidden" name="id_barang" value={transaksiData.id_barang} />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Mitra</label>
            <select
              name="id_mitra"
              value={transaksiData.id_mitra}
              onChange={handleTransaksiInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select Mitra</option>
              {mitras.map(mitra => (
                <option key={mitra.id_mitra} value={mitra.id_mitra}>
                  {mitra.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              name="jenis_transaksi"
              value={transaksiData.jenis_transaksi}
              onChange={handleTransaksiInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="KELUAR">Keluar (Borrow)</option>
              <option value="MASUK">Masuk (Return)</option>
            </select>
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="jumlah"
              value={transaksiData.jumlah}
              onChange={handleTransaksiInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
              min="1"
              max={selectedBarang.stok_akhir}
            />
            <p className="text-sm text-gray-500 mt-1">Available: {selectedBarang.stok_akhir} {selectedBarang.satuan}</p>
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
            <input
              type="date"
              name="tanggal_transaksi"
              value={transaksiData.tanggal_transaksi}
              onChange={handleTransaksiInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Return Date {selectedBarang.id_kategori === 2 ? "(Required)" : "(Optional)"}
            </label>
            <input
              type="date"
              name="return_date"
              value={transaksiData.return_date}
              onChange={handleTransaksiInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required={selectedBarang.id_kategori === 2}
              min={transaksiData.tanggal_transaksi}
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="keterangan"
              value={transaksiData.keterangan}
              onChange={handleTransaksiInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeTransaksiModal}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      {/* Modal for Adding/Editing Mitra */}
      {isMitraModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{mitraData.id_mitra ? "Edit Mitra" : "Add New Mitra"}</h2>
          <button onClick={closeMitraModal}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form onSubmit={handleMitraSubmit}>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="nama"
              value={mitraData.nama}
              onChange={handleMitraInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="no_hp"
              value={mitraData.no_hp}
              onChange={handleMitraInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={mitraData.email}
              onChange={handleMitraInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="alamat"
              value={mitraData.alamat}
              onChange={handleMitraInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              name="perusahaan"
              value={mitraData.perusahaan}
              onChange={handleMitraInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-2 md:mb-4">
            <label className="block text-sm font-medium text-gray-700">Date (Optional)</label>
            <input
              type="date"
              name="at"
              value={mitraData.at}
              onChange={handleMitraInputChange}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeMitraModal}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  )
}