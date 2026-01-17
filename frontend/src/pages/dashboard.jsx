import { useState, useEffect } from "react";
import {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../api/expense";
import "../design/dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeSection, setActiveSection] = useState("recent");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState("");
  const [message, setMessage] = useState("");
  const [expenses, setExpenses] = useState([]);

  // EDIT STATE
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    amount: "",
    paidBy: "",
    splitBetween: "",
  });

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  // ADD EXPENSE
  const handleAddExpense = async () => {
    const data = {
      title: title.trim(),
      amount: Number(amount),
      paidBy: paidBy.trim(),
      splitBetween: splitBetween
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
    };

    const res = await createExpense(data);

    if (res._id) {
      setMessage("Expense added successfully");
      setTitle("");
      setAmount("");
      setPaidBy("");
      setSplitBetween("");
      fetchExpenses();
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await deleteExpense(id);
    fetchExpenses();
  };

  // START EDIT
  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({
      title: expense.title,
      amount: expense.amount,
      paidBy: expense.paidBy,
      splitBetween: expense.splitBetween.join(", "),
    });
  };

  // SAVE EDIT
  const handleUpdate = async (id) => {
    await updateExpense(id, {
      ...editData,
      amount: Number(editData.amount),
      splitBetween: editData.splitBetween
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
    });

    setEditingId(null);
    fetchExpenses();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  /* =====================
     📊 PROFILE SUMMARY
  ====================== */

  const totalSpent = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.createdAt);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const recentExpenses = expenses.slice(0, 3);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Hii :3 {user?.name}</h1>
          <p>Track & split your expenses easily</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-body">
        {/* SIDEBAR */}
        <div className="sidebar">
          <button onClick={() => setActiveSection("profile")}>
            Profile
          </button>
          <button onClick={() => setActiveSection("recent")}>
            Recent Expenses
          </button>
          <button onClick={() => setActiveSection("all")}>
            All Expenses
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="content">
          {/* PROFILE */}
          {activeSection === "profile" && (
            <>
              <div className="card">
                <h2>Profile</h2>
                <p><b>Name:</b> {user?.name}</p>
                <p><b>Email:</b> {user?.email}</p>
              </div>

              {/* SUMMARY CARDS */}
              <div className="summary-grid">
                <div className="summary-card">
                  <h3>Total Spent</h3>
                  <p>₹ {totalSpent}</p>
                </div>

                <div className="summary-card">
                  <h3>This Month</h3>
                  <p>₹ {thisMonthTotal}</p>
                  <span>{thisMonthExpenses.length} expenses</span>
                </div>
              </div>
            </>
          )}

          {/* ADD EXPENSE */}
          {activeSection === "recent" && (
            <div className="card">
              <h2>Add New Expense</h2>

              <div className="form-grid">
                <input
                  placeholder="Expense title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <input
                  placeholder="Paid by"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                />
                <input
                  placeholder="Split between (comma names)"
                  value={splitBetween}
                  onChange={(e) => setSplitBetween(e.target.value)}
                />

                <button className="primary-btn full" onClick={handleAddExpense}>
                  Add Expense
                </button>
              </div>

              {message && <p className="message">{message}</p>}
            </div>
          )}

          {/* RECENT EXPENSES */}
          {activeSection === "recent" && (
            <div className="card">
              <h2>Recent Expenses</h2>

              {recentExpenses.map((e) => (
                <ExpenseItem
                  key={e._id}
                  e={e}
                  editingId={editingId}
                  editData={editData}
                  setEditData={setEditData}
                  startEdit={startEdit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  setEditingId={setEditingId}
                />
              ))}
            </div>
          )}

          {/* ALL EXPENSES */}
          {activeSection === "all" && (
            <div className="card">
              <h2>All Expenses</h2>

              {expenses.map((e) => (
                <ExpenseItem
                  key={e._id}
                  e={e}
                  editingId={editingId}
                  editData={editData}
                  setEditData={setEditData}
                  startEdit={startEdit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  setEditingId={setEditingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExpenseItem = ({
  e,
  editingId,
  editData,
  setEditData,
  startEdit,
  handleUpdate,
  handleDelete,
  setEditingId,
}) => {
  return (
    <div className="expense">
      {editingId === e._id ? (
        <>
          <input
            value={editData.title}
            onChange={(ev) =>
              setEditData({ ...editData, title: ev.target.value })
            }
          />
          <input
            type="number"
            value={editData.amount}
            onChange={(ev) =>
              setEditData({ ...editData, amount: ev.target.value })
            }
          />
          <input
            value={editData.paidBy}
            onChange={(ev) =>
              setEditData({ ...editData, paidBy: ev.target.value })
            }
          />
          <input
            value={editData.splitBetween}
            onChange={(ev) =>
              setEditData({ ...editData, splitBetween: ev.target.value })
            }
          />

          <button onClick={() => handleUpdate(e._id)}>Save</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </>
      ) : (
        <>
          <div className="expense-title">
            {e.title} — ₹{e.amount}
          </div>
          <div className="expense-meta">
            Paid by <b>{e.paidBy}</b>
            <br />
            Split between: {e.splitBetween.join(", ")}
          </div>

          <div className="expense-actions">
            <button onClick={() => startEdit(e)}>Edit</button>
            <button onClick={() => handleDelete(e._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
