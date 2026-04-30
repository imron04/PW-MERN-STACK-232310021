import React from "react";

const ListChoose = [
  {
    id: 1,
    title: "Vast Collection",
    description:
      "Explore thousands of books from various genres, from classics to latest bestsellers.",
    icon: "bi bi-book-half",
  },
  {
    id: 2,
    title: "Fast Delivery",
    description:
      "We ensure your books arrive at your doorstep within 2-3 business days safely.",
    icon: "bi bi-truck",
  },
  {
    id: 3,
    title: "Best Prices",
    description:
      "Get the best value for your money with our daily discounts and member rewards.",
    icon: "bi bi-tags",
  },
  {
    id: 4,
    title: "Secure Payment",
    description:
      "Multiple secure payment options to give you peace of mind while shopping.",
    icon: "bi bi-shield-check",
  },
];

const ChooseCard = ({ item }) => {
  const { title, description, icon } = item;

  return (
    <div className="col-md-3">
      <div className="card h-100 border-0 shadow-sm transition-hover">
        <div className="card-body text-center p-4">
          <div className="mb-3">
            <i className={`${icon} display-4 text-primary`}></i>
          </div>
          <h5 className="fw-bold">{title}</h5>
          <p className="text-muted small mb-0">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ChooseUs = () => {
  return (
    <section id="choose" className="py-5 bg-light">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="fw-bold text-center">Why Choose Us</h2>
            <p className="text-center text-muted">
              Your one-stop destination for all things books
            </p>
          </div>
        </div>

        <div className="row g-4">
          {ListChoose.map((item) => (
            <ChooseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { ChooseUs };
