import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";

import routes from "./routes";

dotenv.config({ path: ".env" });

const app = express();

app.set("port", process.env.PORT);
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({
        name: "JS-Talks Back-End",
        links: [
            {
                rel: "api",
                href: `http://${process.env.HOSTNAME}:${app.get("port")}/api`
            }
        ]
    });
});

app.listen(app.get("port"), () => {
    console.log(
        `\tApp is running at http://${process.env.HOSTNAME}:${app.get(
            "port"
        )} in ${app.get("env")} mode`
    );
    console.log("\tPress CTRL-C to stop\n");
});

export default app;
