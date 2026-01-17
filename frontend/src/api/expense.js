export const createExpense = async (data) => {
  const res = await fetch("http://localhost:5000/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to create expense");
  }

  return result;
};
export const getExpenses = async () => {
  const res = await fetch("http://localhost:5000/api/expenses");

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch expenses");
  }

  return result;
};
export const deleteExpense = async (id) => {
  const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: "DELETE",
  });

  return res.json();
};

export const updateExpense = async (id, data) => {
  const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
