const corsOptions = {
  origin: "http://localhost:5000", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
