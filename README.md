#women in computing triton websites

# Triton2Where

Triton2Where is a web application designed to help users discover places to eat and visit. The platform dynamically filters locations based on user preferences and features a responsive, purple-themed interface.

## Features

*   **Two Browsing Modes**: Users can toggle between "Food" and "Place" categories using the top navigation tab.
*   **Live Weather Widget**: The top bar displays real-time weather conditions, temperature in Fahrenheit, and rain probability for San Diego using the Open-Meteo API.
*   **Dynamic Data Loading**: Location data is fetched and parsed dynamically from a published Google Sheets CSV file using PapaParse.
*   **Advanced Filtering System**:
    *   **Search Bar**: Users can search for specific locations by keyword, which checks the name, description, and tags.
    *   **Cost Slider**: A dual-range slider allows users to set a minimum and maximum price range from $0 to $50+.
    *   **Real-Time "Open Now"**: The app calculates if a location is currently open by comparing the user's local device time with the location's operating hours.
    *   **Discounts & Tags**: Users can filter by "Discount Only" or apply category-specific tags such as "Vegan", "Study!", "Nature & Parks", or "Hidden Gems".
*   **"Pick For Me" Roulette**: A randomized selection feature that plays a scrolling animation to pick a location from the currently filtered list.
*   **Community Submissions**: The sidebar includes a link to a Google Form where users can submit new spots to be added to the database.

## Project Structure

*   **`index.html`**: The main HTML file containing the structure for the top navigation, sidebar filters, and the main results grid.
*   **`css/`**: Contains the stylesheets for the application.
    *   `global.css`: Sets the base layout and resets margins.
    *   `topbar.css`: Styles the header, logo, search bar, and weather widget.
    *   `sidebar.css`: Styles the filter toggles, price slider, and the submission button.
    *   `page.css`: Defines the responsive card grid layout and the "Pick For Me" popup animation.
*   **`js/`**: Contains the JavaScript logic.
    *   `topbar.js`: Manages tab switching UI and fetches San Diego weather data.
    *   `sidebar.js`: Handles the logic for updating the dual-thumb price slider values.
    *   `page.js`: Handles fetching the CSV data, applying filters, rendering the location cards, and executing the random picker animation.

