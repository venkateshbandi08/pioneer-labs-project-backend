const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const { Web3 } = require("web3");

const fetchUser = require("./middlewares/fetchUser");
dotenv.config({ path: "./.env" });
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3001, () => {
  console.log("App server is running on port 3001");
});

const MongoUri = process.env.DRIVER_LINK;
const connectToMongo = async () => {
  try {
    await mongoose.connect(MongoUri);
    console.log("Connected to your MongoDB database successfully");
  } catch (error) {
    console.log(error.message);
  }
};

connectToMongo();


app.get("/api/getdata", fetchUser, async (req, res) => {
  try {
    const { limit, category } = req.query;

    const host = `https://api.publicapis.org/entries?Category=${category}`;

    const { data } = await axios.get(host);

    const count = data.count;
    let setLimit = 0;
    let results = 0;

    if (parseInt(limit) < 0) {
      return res.status(400).json({ msg: "Invalid limitation of data" });
    }

    if (limit === "0" || limit >= count) {
      setLimit = count;
      results = count;
    } else if (limit > 0 && limit < count) {
      setLimit = limit;
      results = limit;
    }
    const entries = data.entries.slice(0, setLimit);

    return res.status(200).json({ entries, results });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Server issue :(",
    });
  }
});

//swagger ui documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./info.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//which provides access to Ethereum and IPFS nodes via APIs - Infura
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);

app.get("/ethbalance/:address", async (req, res) => {
  try {
    const balanceWei = await web3.eth.getBalance(req.params.address);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    res.send({ balance: balanceEth });
  } catch (error) {
    res.status(500).send("Error fetching balance");
  }
});