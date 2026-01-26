export default function Hero() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Smart Campus Resource Management
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          Book library resources, lab equipment, and manage schedules —
          efficiently and fairly.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md">
            Explore Resources
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
