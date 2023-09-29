# Otomoto Scraper
This program is designed to scrape data from the Otomoto website using Puppeteer and Cheerio libraries. It collects information about used Mercedes-Benz trucks listed on the website. The program is written in Node.js, using version 18 as the engine.

This program is designed for scraping data from the otomoto site using the provided interface.. The program uses Puppeteer version 18.1.0 for browsing and interacting with web elements and Cheerio for parsing and traversing HTML.

Note: The latest version of Puppeteer has a dependency issue on Linux machines, so it is recommended to use version 18.1.0.

# Author
This program was written by Mustak Ahmed.

# Dependencies
- Node.js: v18
- Puppeteer: v18.1.0
- Cheerio

## Installation

To install and run this project, follow these steps:

1. Clone this repository. 
2. Navigate to the project directory.
3. Install proper nodejs version, for this project we used `v18`
4. Run the command `npm install` to install the dependencies.
5. Run the command `npm start` to start the app.
- Then this program will start in headless: true mode, and the log can be seen in the console.

# Functionality
The program performs the following tasks:

- Launches a browser instance and loads the URL.
- Accepts the cookie policy on each page load.
- It uses retry mechanism to go to provied url, for this progam we set 3 as the retry times
- Scrapes data from the otomoto site for the provided url
- Retrieves data for truck items, including item URLs and item IDs.
- Detects if it is on the last page of the paginated list.
- Retrieves the next page URL in the pagination context.
- Retrieves the total count of ads available to scrape.
- Scrapes actual add items.
- Retrieves information such as the item id, title, price, registration date, production date, mileage, and power of each add item.

- Parses the HTML content using Cheerio.
- Scrapes all pages in the pagination context recursively.
- The program provides logging and output for various steps, including the total number of truck items found on each page, the total count of ads, and the total number of ads scraped.

# Usage
Install the dependencies by running `npm install`.

Run the program by executing `npm start`.

The program will scrape all the pages of Mercedes-Benz trucks on Otomoto and collect the data.

The scraped data will be stored in the scrapedData array.

Please note that this program is specifically designed for the provided Otomoto URL and may not work for other 
websites or URLs.


# LICENSE
MIT License

Copyright (c) 2023 mahmed0715
