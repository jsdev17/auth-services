const app = require("express")();
const bodyParser = require("body-parser");
const { name : serviceName = "Server" } = require("../package.json");
const { PORT = 3000 } = process.env;
const { pool } = require("../utils/db");

const { jwt : jwtSettings } = require("../config");
const { checkWhitelist, generateJwt } = require("../utils/auth");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Service health check endpoint
app.get("/jwt-factory", (req, res) => {
    res.status(200).send(true);
});

app.post("/api/jwt-factory", checkWhitelist, (req, res) => {
    /** 
     * if the whitelist check passses, we should attach a proper
     * payload to the request object (jwtPayload).
     * If program control has reached this endpoint, we can then
     * assume there's a jwtPayload object attached to the request.
     */
  
    let { jwtPayload } = req;

    /**
     * @todo
     * validate payload
     * reject or generate token
     */
    
    const token = generateJwt(jwtSettings, jwtPayload);
    const msg = req.whitelistCheckMsg; // attached inside checkWhitelist middleware method
    
    res.status(200).send({ msg, token });
});


app.listen(PORT, async () => {
    console.log("%s running and listening on port %s", serviceName, PORT);
    // Service spawns its own connection pool.
    try
    {
        await pool.connect();
        console.log("Connected to DB.");
    }
    catch (dbConnectionError)
    {
        console.log("Failed to connect to DB.");
        console.log(dbConnectionError);

        console.log("Will not even attempt to start service.");
        console.log("Process ending now with exit code 1.");
        process.exit(1);
    }
})