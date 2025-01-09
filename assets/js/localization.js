// Function to load translations dynamically
async function loadTranslations(lang) {
    try {
      const response = await fetch(`../locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load translations for ${lang}`);
      }
      const translations = await response.json();
      return translations;
    } catch (error) {
      console.error(error);
      return null; // Fallback if translations cannot be loaded
    }
  }
  
  // Function to translate text
  let currentTranslations = {};
  
  function translate(key) {
    return currentTranslations[key] || key;
  }
  
  // Example usage
  async function initLocalization(lang = 'en') { // Default to 'en' if no lang is provided
    currentTranslations = await loadTranslations(lang) || await loadTranslations('en'); // Fallback to 'en'
    
    // Update the UI
    document.getElementById('welcome-message').textContent = translate('welcome');
    document.getElementById('goodbye-message').textContent = translate('goodbye');
  }
  
  // Call initLocalization with the default language on page load
  (async function() {
    const userLang = navigator.language.split('-')[0]; // Get browser language (e.g., "en-US" -> "en")
    await initLocalization(userLang); // Initialize with user language
  })();
  