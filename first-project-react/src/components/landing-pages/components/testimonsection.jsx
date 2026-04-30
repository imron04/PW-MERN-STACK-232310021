import React from "react";

const user_testimonials = [
  {
    name: "Andi Saputra",
    review: "Buku-bukunya sangat berkualitas dan pengirimannya cepat banget!",
    rating: 5,
  },
  {
    name: "Siti Aminah",
    review:
      "Koleksinya lengkap, saya menemukan buku langka yang sudah lama dicari.",
    rating: 4,
  },
  {
    name: "Budi Pratama",
    review: "Pelayanan pelanggan sangat responsif dan ramah. Recommended!",
    rating: 5,
  },
];

export function TestimonialSection() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row mb-5">
          <div className="col">
            <h2 className="fw-bold text-center">What Our Readers Say</h2>
            <p className="text-center text-muted">
              Join thousands of satisfied book lovers
            </p>
          </div>
        </div>

        <div className="row g-4">
          {user_testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        // Perbaikan: template literal jangan diputus barisnya
                        className={`bi bi-star${i < testimonial.rating ? "-fill" : ""} text-warning`}
                      ></i>
                    ))}
                  </div>

                  <p className="card-text mb-4 italic text-secondary">
                    "{testimonial.review}"
                  </p>

                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <i
                        className="bi bi-person-fill text-white"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                      <small className="text-muted">Verified Buyer</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
