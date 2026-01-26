const features = [
  {
    title: "Library Management",
    description: "Search, issue, and track books digitally with ease."
  },
  {
    title: "Lab Equipment Booking",
    description: "Fair booking system with waitlists and usage tracking."
  },
  {
    title: "Resource Usage Tracking",
    description: "Track availability, usage history, and equipment health."
  },
  {
    title: "Admin Control",
    description: "Monitor resource usage and prevent misuse."
  }
];


export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          What Can You Do Here?
        </h3>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md"
            >
              <h4 className="text-xl font-semibold text-blue-600">
                {f.title}
              </h4>
              <p className="mt-2 text-gray-600 text-sm">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
