# Otomoto Scraper
This program is designed to scrape data from the Otomoto website using Puppeteer and Cheerio libraries. It collects information about used Mercedes-Benz trucks listed on the website. The program is written in Node.js, using version 18 as the engine.

# Program Description
This program is designed for scraping data from the otomoto site using the provided interface. It is written in Node.js, using version 18 as the engine. The program uses Puppeteer version 18.1.0 for browsing and interacting with web elements, and Cheerio for parsing and traversing HTML.


# Author
This program was written by Mustak Ahmed.

# Dependencies
Node.js: v18
Puppeteer: v18.1.0
Cheerio

# Instructions
To run the program, follow these steps:

Install Node.js version 18 or higher.
Install the following dependencies: Puppeteer version 18.1.0 and Cheerio.
Execute the program using the command node filename.js.
Note: The latest version of Puppeteer has a dependency issue on Linux machines, so it is recommended to use version 18.1.0.


## Installation

To install and run this project locally, follow these steps:

1. Clone this repository.
2. Navigate to the project directory.
4. Install proper nodejs version, for this project we used `v18`
3. Run the command `npm install` to install the dependencies.
4. Run the command `npm start` to start the app.


# Functionality
The program performs the following tasks:

Scrapes data from the otomoto site.
Retrieves data for truck items, including item URLs and item IDs.
Detects if it is on the last page of the paginated list.
Retrieves the next page URL in the pagination context.
Retrieves the total count of ads available to scrape.
Scrapes actual add items.
Retrieves information such as the title, price, registration date, production date, mileage, and power of each add item.
Accepts the cookie policy on each page load.
Launches a browser instance and loads the URL.
Parses the HTML content using Cheerio.
Scrapes all pages in the pagination context recursively.
The program provides logging and output for various steps, including the total number of truck items found on each page, the total count of ads, and the total number of ads scraped.

Please ensure that you have the necessary permissions and rights to scrape data from the otomoto site.

# Usage
Install the dependencies by running `npm install`.
Run the program by executing `npm start`.
The program will scrape all the pages of Mercedes-Benz trucks on Otomoto and collect the data.
The scraped data will be stored in the scrapedData array.
Please note that this program is specifically designed for the provided Otomoto URL and may not work for other websites or URLs.