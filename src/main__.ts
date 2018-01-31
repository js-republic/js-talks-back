import { addTalk, findTalks } from "./requests";
import { Talk } from "./types";
import { initDatabase } from "./database";


// initDatabase();
const aTalk: Talk = {
  description: "une description",
  author: { id: 1, email: "toto" },
  duration: "30",
  title: "un titre",
  kind: "request",
  scheduledAt: new Date(),
  likes: [],
  speakers: [],
};

(async ()  => {
  // await insertTalk(aTalk);
  const talks = await findTalks();
  console.log(talks);
})();


