import { useEffect, useState } from "react";
import AddBooksModal from "../../components/library/AddBooksModal";
import { fetchActiveIssues, fetchOverdueIssues, searchBookByName, issueBook, returnBook, getBookByAccession, updateBookStatus } from "../../api/library.api";
import { useNavigate } from "react-router-dom";
import ViewProfile from "../../components/profile/ViewProfile";

export default function LibrarianDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [issueForm, setIssueForm] = useState({ accessionNumber: "", email: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [userName, setUserName] = useState("");

  // book status update related
  const [statusForm, setStatusForm] = useState({ accessionNumber: "", status: "" });
  const [lookingUp, setLookingUp] = useState(false);
  const [foundBook, setFoundBook] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // overdue issues
  const [overdueIssues, setOverdueIssues] = useState([]);
  const [loadingOverdue, setLoadingOverdue] = useState(true);

  // return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnResult, setReturnResult] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigate = useNavigate();

  const loadIssues = async () => {
    try {
      setLoading(true);
      const res = await fetchActiveIssues();
      setIssues(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    loadOverdue();
    const n = localStorage.getItem("userName");
    if (n) setUserName(n);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await searchBookByName(value);
      setSearchResults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssue = async () => {
    if (!issueForm.accessionNumber || !issueForm.email) {
      alert("Please fill accession number and student email");
      return;
    }

    try {
      setActionLoading(true);
      await issueBook(issueForm);
      alert("Book issued successfully");
      setIssueForm({ accessionNumber: "", email: "" });
      loadIssues();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to issue book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async (accessionNumber) => {
    try {
      setActionLoading(true);
      const res = await returnBook({ accessionNumber });
      setReturnResult(res.data.data);
      setShowReturnModal(true);
      loadIssues();
      loadOverdue();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to return book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const loadOverdue = async () => {
    try {
      setLoadingOverdue(true);
      const res = await fetchOverdueIssues();
      setOverdueIssues(res.data.data);
    } catch (err) {
      console.error(err);
      setOverdueIssues([]);
    } finally {
      setLoadingOverdue(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Librarian Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {userName || 'Librarian'}!</p>
        </div>

        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700">Logout</button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-4 border-b-2">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "dashboard"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          My Profile
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && <ViewProfile />}

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
      <>
      <div className="flex gap-4 mb-6 items-start">
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Add Books</button>

        <div>
          <input
            type="text"
            placeholder="Search book by name"
            className="border px-3 py-2 rounded w-64"
            value={searchTerm}
            onChange={handleSearch}
          />

          {searchResults.length > 0 && (
            <div className="bg-white border rounded mt-2 w-96 max-h-64 overflow-y-auto shadow">
              {searchResults.map((book) => (
                <div key={book.accessionNumber} className="p-2 border-b hover:bg-gray-100 cursor-pointer" onClick={() => setIssueForm({...issueForm, accessionNumber: book.accessionNumber})}>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author} • {book.accessionNumber} • {book.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Issue Book</h3>
          <input placeholder="Accession Number" value={issueForm.accessionNumber} onChange={(e) => setIssueForm({...issueForm, accessionNumber: e.target.value})} className="border px-3 py-2 rounded w-56 mb-2" />
          <input placeholder="Student Email" value={issueForm.email} onChange={(e) => setIssueForm({...issueForm, email: e.target.value})} className="border px-3 py-2 rounded w-56 mb-2" />
          <div className="flex gap-2 mb-3">
            <button onClick={handleIssue} disabled={actionLoading} className="bg-green-600 text-white px-3 py-1 rounded">Issue</button>
            <button onClick={() => setIssueForm({ accessionNumber: "", email: "" })} className="px-3 py-1 border rounded">Clear</button>
          </div>

          <h3 className="font-semibold mb-2">Update Book Status</h3>
          <div className="flex gap-2 items-center mb-2">
            <input placeholder="Accession Number" value={statusForm.accessionNumber} onChange={(e) => setStatusForm({...statusForm, accessionNumber: e.target.value})} className="border px-3 py-2 rounded w-48" />
            <button onClick={async () => {
              if (!statusForm.accessionNumber) { alert('Enter accession number'); return; }
              setLookingUp(true);
              try {
                const res = await getBookByAccession(statusForm.accessionNumber);
                setFoundBook(res.data.data);
              } catch (err) {
                alert(err.response?.data?.message || 'Book not found');
                setFoundBook(null);
              } finally {
                setLookingUp(false);
              }
            }} disabled={lookingUp} className="px-3 py-1 border rounded">{lookingUp ? 'Finding...' : 'Find'}</button>
          </div>

          {foundBook && (
            <div className="bg-gray-50 p-2 rounded mb-2">
              <p className="font-medium">{foundBook.title}</p>
              <p className="text-sm text-gray-600">{foundBook.author} • {foundBook.accessionNumber} • {foundBook.status}</p>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <select value={statusForm.status} onChange={(e) => setStatusForm({...statusForm, status: e.target.value})} className="border px-3 py-2 rounded">
              <option value="">-- Select status --</option>
              <option value="LOST">LOST</option>
              <option value="DAMAGED">DAMAGED</option>
            </select>

            <button onClick={async () => {
              if (!statusForm.accessionNumber || !statusForm.status) { alert('Provide accession number and status'); return; }
              setUpdateLoading(true);
              try {
                await updateBookStatus(statusForm);
                alert('Book status updated');
                setFoundBook(null);
                setStatusForm({ accessionNumber: '', status: '' });
                loadIssues();
              } catch (err) {
                alert(err.response?.data?.message || 'Failed to update status');
              } finally {
                setUpdateLoading(false);
              }
            }} disabled={updateLoading} className="bg-yellow-600 text-white px-3 py-1 rounded">Update</button>
          </div>
        </div>
      </div>
      </>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Active Book Issues</h2>

        {loading ? (
          <p>Loading...</p>
        ) : issues.length === 0 ? (
          <p>No active issues</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Issue No</th>
                <th className="border p-2">Book</th>
                <th className="border p-2">Student</th>
                <th className="border p-2">Issued At</th>
                <th className="border p-2">Due Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td className="border p-2">{issue.issueNumber}</td>
                  <td className="border p-2">{issue.book.title} <br /><span className="text-sm text-gray-500">({issue.book.accessionNumber})</span></td>
                  <td className="border p-2">{issue.user.name} <br /><span className="text-sm text-gray-500">{issue.user.email}</span></td>
                  <td className="border p-2">{new Date(issue.issuedAt).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(issue.dueAt).toLocaleDateString()}</td>
                  <td className="border p-2">
                    <button onClick={() => handleReturn(issue.book.accessionNumber)} className="text-green-600">Return</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Overdue Issues */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="font-semibold mb-4">Overdue Book Issues</h2>

        {loadingOverdue ? (
          <p>Loading...</p>
        ) : overdueIssues.length === 0 ? (
          <p>No overdue issues</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-red-100">
              <tr>
                <th className="border p-2">Issue No</th>
                <th className="border p-2">Book</th>
                <th className="border p-2">Student</th>
                <th className="border p-2">Issued At</th>
                <th className="border p-2">Due Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {overdueIssues.map((issue) => (
                <tr key={issue._id} className="bg-red-50">
                  <td className="border p-2">{issue.issueNumber}</td>
                  <td className="border p-2">{issue.book.title} <br /><span className="text-sm text-gray-500">({issue.book.accessionNumber})</span></td>
                  <td className="border p-2">{issue.user.name} <br /><span className="text-sm text-gray-500">{issue.user.email}</span></td>
                  <td className="border p-2">{new Date(issue.issuedAt).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(issue.dueAt).toLocaleDateString()}</td>
                  <td className="border p-2">
                    <button onClick={() => handleReturn(issue.book.accessionNumber)} className="text-green-600">Return</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddBooksModal onClose={() => { setShowAddModal(false); loadIssues(); loadOverdue(); }} />
      )}

      {/* Return result modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[420px] shadow">
            <h3 className="font-semibold mb-2">Return Summary</h3>
            {returnResult ? (
              <div>
                <p>Issue #: <strong>{returnResult.issueNumber}</strong></p>
                <p>Accession #: <strong>{returnResult.accessionNumber}</strong></p>
                <p>Returned At: <strong>{new Date(returnResult.returnedAt).toLocaleString()}</strong></p>
                <p>Fine Amount: <strong>{returnResult.fineAmount}</strong></p>
              </div>
            ) : (
              <p>No details available</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
