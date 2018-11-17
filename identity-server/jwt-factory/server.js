const app = require("express")();
const bodyParser = require("body-parser");
const { name:projName = "Server" } = require("./package.json");
const { PORT = 3000 } = process.env;

const { jwt:jwtSettings } = require("./config");
const { checkWhitelist, checkWhitelistPost, generateJwt } = require("./utils/auth");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Service health check endpoint
app.get("/jwt-factory", (req, res) => {
    res.status(200).send(true);
});

// Service API endpoint
/** @deprecated */
app.get("/api/jwt-factory", checkWhitelist, (req, res) => {
    /** 
     * if the whitelist check passses, we should attach a proper
     * payload to the request object (jwtPayload).
     * If program control has reached this endpoint, we can then
     * assume there's a jwtPayload object attached to the request.
     * We will pass that payload to generateJwt(settings, payload).
     */
    /** @todo validate payload before generating token '
     * @method validatePayload(jwtPayload)?
    */
    // let payload = validateJwtPayload(req.jwtPayload);
    let payload = req.jwtPayload ? req.jwtPayload : null;
    const token = generateJwt(jwtSettings, payload);
    const msg = "This is where you can get a JWT.";

    res.status(200).send({ msg, token });
});


app.post("/api/jwt-factory", checkWhitelistPost, (req, res) => {
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
    const msg = "This is where you can get a JWT.";
    
    res.status(200).send({ msg, token });
});


app.listen(PORT, () => {
    console.log("%s running and listening on port %s", projName, PORT);
})