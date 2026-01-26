const steps = [
  "Login with campus account",
  "Browse available resources",
  "Book or join waitlist",
  "Use and return — system updates automatically"
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          How It Works
        </h3>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <span className="text-blue-600 font-bold">
                Step {i + 1}
              </span>
              <p className="mt-2 text-gray-600">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
