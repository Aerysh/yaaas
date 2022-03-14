const express = require("express");
require("dotenv/config");
const PORT = process.env.PORT || 8000;
const app = express();
var cors = require("cors");

app.use(cors());

// Import Router
const allRouter = require("./routes/all");
const latestRouter = require("./routes/latest");
const popularRouter = require("./routes/weekPopular");
const searchRouter = require("./routes/search");
const detailRouter = require("./routes/detail");
const readRouter = require("./routes/read");
const genreRouter = require("./routes/genres");

app.use("/all", allRouter);
app.use("/latest", latestRouter);
app.use("/popular", popularRouter);
app.use("/search", searchRouter);
app.use("/detail", detailRouter);
app.use("/read", readRouter);
app.use("/genre", genreRouter);

app.get("/", (req, res) => {
	res.json({message: "Manhwaindo.id API, https://github.com/Aerysh/manhwaindo-api"});
});

app.listen(PORT, () => {
	console.log(`App listening http://localhost:${PORT}`);
});