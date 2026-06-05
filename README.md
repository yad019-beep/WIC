#women in computing triton websites

# Triton2Where

Triton2Where is a web application designed to help users discover places to eat and visit[cite: 2]. The platform dynamically filters locations based on user preferences and features a responsive, purple-themed interface[cite: 2, 7].

## Features

*   **Two Browsing Modes**: Users can toggle between "Food" and "Place" categories using the top navigation tabs[cite: 2, 4].
*   **Live Weather Widget**: The top bar displays real-time weather conditions, temperature in Fahrenheit, and rain probability for San Diego using the Open-Meteo API[cite: 4].
*   **Dynamic Data Loading**: Location data is fetched and parsed dynamically from a published Google Sheets CSV file using PapaParse[cite: 3].
*   **Advanced Filtering System**:
    *   **Search Bar**: Users can search for specific locations by keyword, which checks the name, description, and tags[cite: 3].
    *   **Cost Slider**: A dual-range slider allows users to set a minimum and maximum price range from $0 to $50+[cite: 2, 5].
    *   **Real-Time "Open Now"**: The app calculates if a location is currently open by comparing the user's local device time with the location's operating hours[cite: 3].
    *   **Discounts & Tags**: Users can filter by "Discount Only" or apply category-specific tags such as "Vegan", "Study!", "Nature & Parks", or "Hidden Gems"[cite: 2, 3].
*   **"Pick For Me" Roulette**: A randomized selection feature that plays a scrolling animation to pick a location from the currently filtered list[cite: 3].
*   **Community Submissions**: The sidebar includes a link to a Google Form where users can submit new spots to be added to the database[cite: 2].

## Project Structure

*   **`index.html`**: The main HTML file containing the structure for the top navigation, sidebar filters, and the main results grid[cite: 2].
*   **`css/`**: Contains the stylesheets for the application[cite: 2].
    *   `global.css`: Sets the base layout and resets margins[cite: 9].
    *   `topbar.css`: Styles the header, logo, search bar, and weather widget[cite: 6].
    *   `sidebar.css`: Styles the filter toggles, price slider, and the submission button[cite: 8].
    *   `page.css`: Defines the responsive card grid layout and the "Pick For Me" popup animation[cite: 7].
*   **`js/`**: Contains the JavaScript logic[cite: 2].
    *   `topbar.js`: Manages tab switching UI and fetches San Diego weather data[cite: 4].
    *   `sidebar.js`: Handles the logic for updating the dual-thumb price slider values[cite: 5].
    *   `page.js`: Handles fetching the CSV data, applying filters, rendering the location cards, and executing the random picker animation[cite: 3].

