import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const { API_URL: apiUrl, API_KEY: apiKey } = process.env;

// Render home page
const renderDashboard = (req, res) => {
  res.render('index', { content: 'Waiting for data...' });
};

// Handle recipe search
const searchRecipes = async (req, res) => {
  try {
    const recipe = req.query.recipes;
    console.log(`Searching for "${recipe}" recipes.`)
    const results = await axios.get(`${apiUrl}complexSearch`, {
      params: {
        apiKey: apiKey,
        query: recipe,
        number: 1000,
      },
    });

    res.render('results', {
      searched: recipe.toUpperCase() + ' RECIPES',
      content: results.data,
      errs: null,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.render('results', {
      searched: req.query.recipes.toUpperCase() + ' RECIPES',
      content: { results: [] },
      errs: 'An error occurred while fetching the recipes.',
    });
  }
};

// Handle recipe details
const recipeDetails = async (req, res) => {
  try {
    const { recipeId, recipeImg, recipeTitle } = req.query;
    console.log(`Searching for details of "${recipeTitle}" recipe.`)
    const response = await axios.get(`${apiUrl}/${recipeId}/information`, {
      params: { apiKey: apiKey },
    });

    res.render('details', {
      title: recipeTitle,
      img: recipeImg,
      content: response.data,
    });
  } catch (error) {
    console.error('Error fetching recipe details:', error.message);
    res.render('details', {
      title: recipeTitle || 'Recipe Details',
      img: recipeImg,
      errs: 'Failed to fetch recipe details.',
    });
  }
};

export {renderDashboard, searchRecipes, recipeDetails,}