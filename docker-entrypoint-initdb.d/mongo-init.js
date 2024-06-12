db = db.getSiblingDB("local_library_pp");

db.createUser({
  user: "username",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "local_library_pp",
    },
  ],
});

db.createCollection("authors");
db.createCollection("books");
db.createCollection("copies");
db.createCollection("genres");

db.authors.insertMany([
  {
    firstName: "Patrick",
    lastName: "Rothfuss",
    dateOfBirth: "1973-06-06",
    dateOfDeath: null,
  },
  {
    firstName: "Ben",
    lastName: "Bova",
    dateOfBirth: "1932-11-08",
    dateOfDeath: null,
  },
  {
    firstName: "Isaac",
    lastName: "Asimov",
    dateOfBirth: "1920-01-02",
    dateOfDeath: "1992-04-06",
  },
  {
    firstName: "Bob",
    lastName: "Billings",
    dateOfBirth: "1915-05-18",
    dateOfDeath: "1980-10-08",
  },
  {
    firstName: "Jim",
    lastName: "Jones",
    dateOfBirth: "1971-12-16",
    dateOfDeath: null,
  },
]);

db.genres.insertMany([
  {
    name: "Fantasy",
  },
  {
    name: "Science Fiction",
  },
  {
    name: "French Poetry",
  },
]);

db.books.insertMany([
  {
    title: "The Name of the Wind (The Kingkiller Chronicle, #1)",
    author: db.authors.findOne({ lastName: "Rothfuss" })._id,
    summary:
      "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have " +
      "spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at " +
      "a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during " +
      "day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
    isbn: "9781473211896",
    genres: [db.genres.findOne({ name: "Fantasy" })._id],
  },
  {
    title: "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    author: db.authors.findOne({ lastName: "Rothfuss" })._id,
    summary:
      "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, " +
      "courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest " +
      "magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
    isbn: "9788401352836",
    genres: [db.genres.findOne({ name: "Fantasy" })._id],
  },
  {
    title: "The Slow Regard of Silent Things (Kingkiller Chronicle)",
    author: db.authors.findOne({ lastName: "Rothfuss" })._id,
    summary:
      "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways " +
      "and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in " +
      "the heart of this forgotten place.",
    isbn: "9780756411336",
    genres: [db.genres.findOne({ name: "Fantasy" })._id],
  },
  {
    title: "Apes and Angels",
    author: db.authors.findOne({ lastName: "Bova" })._id,
    summary:
      "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to " +
      "the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is " +
      "spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
    isbn: "9780765379528",
    genres: [db.genres.findOne({ name: "Science Fiction" })._id],
  },
  {
    title: "Death Wave",
    author: db.authors.findOne({ lastName: "Bova" })._id,
    summary:
      "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They " +
      "discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan " +
      "Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly " +
      "radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on " +
      "Earth will be wiped out...",
    isbn: "9780765379504",
    genres: [db.genres.findOne({ name: "Science Fiction" })._id],
  },
  {
    title: "Test Book 1",
    author: db.authors.findOne({ lastName: "Jones" })._id,
    summary: "Summary of test book 1",
    isbn: "ISBN111111",
    genres: [
      db.genres.findOne({ name: "Fantasy" })._id,
      db.genres.findOne({ name: "Science Fiction" })._id,
    ],
  },
  {
    title: "Test Book 2",
    author: db.authors.findOne({ lastName: "Jones" })._id,
    summary: "Summary of test book 2",
    isbn: "ISBN222222",
    genres: null,
  },
]);

db.copies.insertMany([
  {
    book: db.books.findOne({
      title: "The Name of the Wind (The Kingkiller Chronicle, #1)",
    })._id,
    imprint: "London Gollancz, 2014.",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({
      title: "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    })._id,
    imprint: "Gollancz, 2011.",
    dueBack: false,
    status: "Loaned",
  },
  {
    book: db.books.findOne({
      title: "The Slow Regard of Silent Things (Kingkiller Chronicle)",
    })._id,
    imprint: "Gollancz, 2015.",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({ title: "Apes and Angels" })._id,
    imprint: "New York Tom Doherty Associates, 2016.",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({ title: "Apes and Angels" })._id,
    imprint: "New York Tom Doherty Associates, 2016.",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({ title: "Apes and Angels" })._id,
    imprint: "New York Tom Doherty Associates, 2016.",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({ title: "Death Wave" })._id,
    imprint: "New York, NY Tom Doherty Associates, LLC, 2015.",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({ title: "Death Wave" })._id,
    imprint: "New York, NY Tom Doherty Associates, LLC, 2015.",
    dueBack: false,
    status: "Maintenance",
  },
  {
    book: db.books.findOne({ title: "Death Wave" })._id,
    imprint: "New York, NY Tom Doherty Associates, LLC, 2015.",
    dueBack: false,
    status: "Loaned",
  },
  {
    book: db.books.findOne({
      title: "The Name of the Wind (The Kingkiller Chronicle, #1)",
    })._id,
    imprint: "Imprint XXX2",
    dueBack: false,
    status: "Available",
  },
  {
    book: db.books.findOne({
      title: "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    })._id,
    imprint: "Imprint XXX3",
    dueBack: false,
    status: "Loaned",
  },
]);
