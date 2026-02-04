import { useState } from "react";
import { addBooks } from "../../api/library.api";

function AddBooksModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publisher: "",
    publishedYear: "",
    copies: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await addBooks({
        ...form,
        copies: Number(form.copies),
        publishedYear: Number(form.publishedYear),
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[420px]">
        <h2 className="text-lg font-semibold mb-4">Add Books</h2>

        {[
          "title",
          "author",
          "isbn",
          "category",
          "publisher",
          "publishedYear",
          "copies",
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field}
            className="border px-3 py-2 rounded w-full mb-2"
          />
        ))}

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Adding..." : "Add Books"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBooksModal;
