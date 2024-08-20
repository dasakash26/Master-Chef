import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import useragent from "useragent";
dotenv.config();

const app = express();
const port = 4000;
const url = process.env.URL;
const key = process.env.API_KEY;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.path === "/") {
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);

    // Log device information
    console.log(`Login attempt detected from:`);
    console.log(`- Browser: ${agent.toAgent()}`);
    console.log(`- OS: ${agent.os.toString()}`);
    console.log(`- Device: ${agent.device.toString()}`);
  }
  next();
});

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.get("/search-results", async (req, res) => {
  try {
    const recipe = req.query.recipes;
    console.log(recipe);
    const results = await axios.get(`${url}complexSearch`, {
      params: {
        apiKey: key,
        query: recipe,
        number: 1000,
      },
    });

    res.render("results.ejs", {
      searched: recipe.toUpperCase() + " RECIPES",
      content: results.data,
      errs: null,
    });
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
    res.render("results.ejs", {
      searched: req.query.recipes.toUpperCase() + " RECIPES",
      content: { results: [] },
      errs:
        error.response?.data?.message ||
        "An error occurred while fetching the recipes.",
    });
  }
});

app.get("/recipe-details", async (req, res) => {
  try {
    const recipeId = req.query.recipeId;
    const recipeImg = req.query.recipeImg;
    const recipeTitle = req.query.recipeTitle;

    if (!recipeId) {
      throw new Error("Recipe ID is required.");
    }

    const response = await axios.get(`${url}/${recipeId}/information`, {
      params: {
        apiKey: key,
      },
    });

    res.render("details.ejs", {
      title: recipeTitle,
      img: recipeImg,
      content: response.data,
    });
  } catch (error) {
    console.log(error.response?.data?.message || error.message);
    res.render("details.ejs", {
      errs: error.response?.data?.message || "Failed to fetch recipe details.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
