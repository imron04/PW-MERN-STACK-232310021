export function FeaturesSection() {
  return (
    <section id="books" className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col">
            <h2 className="fw-bold text-center">Featured Books</h2>
            <p className="text-center text-muted">
              Handpicked selections just for you.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {ListBooks.map((book) => (
            <div key={book.id} className="col-md-6 col-lg-3">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ListBooks = [
  {
    id: 1,
    title: "Pride & Prejudice",
    img: "pp.jpg",
    author: "Jane Austen",
    is_free: false,
    sinopsis:
      " Elizabeth Bennet, gadis cerdas dari keluarga menengah di pedesaan Inggris, yang mengatasi prasangka (prejudice) untuk menemukan cinta dengan Mr. Darcy, bangsawan kaya yang angkuh (pride)",
    rating: 4.5,
    views: 100,
  },
  {
    id: 2,
    title: "No Longer Human",
    img: "human.webp",
    author: "Osamu Dazai",
    is_free: false,
    sinopsis:
      "Yozo Oba, seorang pria yang merasa terasing dari kemanusiaan dan gagal memahami manusia. Sepanjang hidupnya, Yozo mengenakan 'topeng' badut untuk menutupi depresi, ketakutan, dan rasa tidak amannya, yang akhirnya membawa pada kehancuran diri, kecanduan, dan keputusasaan mendalam.",
    rating: 4.5,
    views: 100,
  },
  {
    id: 3,
    title: "A Study in Scarlet",
    img: "sh.jpg",
    author: "Sir Arthur Conan Doyle",
    is_free: false,
    sinopsis:
      "Dr John H. Watson bertemu dengan detektif besar Sherlock Holmes dan bersama-sama mereka memecahkan kasus pembunuhan, di mana Watson kagum pada 'ilmu deduksi' Holmes.",
    rating: 5,
    views: 100,
  },
  {
    id: 4,
    title: "The Old Man and the Sea",
    img: "old.jpg",
    author: "Ernest Hemingway",
    is_free: false,
    sinopsis:
      "Novel The Old Man and The Sea bercerita tentang lelaki tua bernama Santiago. Ia tidak pernah menyerah untuk terus berlayar dengan kapal kecilnya demi mendapatakan seekor ikan. Lelaki tua itu dijuluki “Salao”, orang yang tersial dari yang sial karena selama 84 hari berlayar selalu gagal membawa pulang seekor ikan pun.",
    rating: 4.5,
    views: 100,
  },
];

const BookCard = ({ book }) => {
  const { title, author, rating, img } = book;

  // Fungsi untuk merender bintang berdasarkan rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi bi-star${i < Math.floor(rating) ? "-fill" : ""} text-warning`}
      ></i>
    ));
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body text-center">
        <div className="bg-light p-4 mb-3 rounded">
          {img ? (
            <img
              src={`/books-images/${img}`}
              alt={title}
              className="img-fluid"
              style={{ maxHeight: "150px", objectFit: "cover" }}
            />
          ) : (
            <i
              className="bi bi-book-half"
              style={{ fontSize: "4rem", color: "#6c757d" }}
            ></i>
          )}
        </div>
        <h5 className="card-title fw-bold">{title}</h5>
        <p className="text-muted small mb-2">by {author}</p>
        <div className="mb-2">
          {renderStars(rating)}
          <span className="ms-2 text-muted small">({rating})</span>
        </div>
      </div>
    </div>
  );
};
