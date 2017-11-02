const express = require("express");
const bodyParser = require("body-parser");

const config = require("./config");

const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
	next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.static(`${__dirname}/public`));
// app.use("/public", express.static(`${__dirname}/public`));

require("./routes/")(app);

app.listen(config.port, () => console.log(`Server started at port ${config.port}`));