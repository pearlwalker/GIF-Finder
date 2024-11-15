/**
 * gif-finder.html > main.js
 */

//	A. EXPLANATION
		// 1
		window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

		// 2
		let displayTerm = "";

		// 3
		function searchButtonClicked() {
			console.log("searchButtonClicked() called");
			//Part IV. Code

			//#1 - Giphy Search *Endpoint*
			const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

			//#2 - Identifies you as owner of the service,
			/* 
			* API keys keep track of how the API is being used
			* This API key is registered by RIT for this exercise
			*/
			let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

			//#3 - Build URL string
			let url = GIPHY_URL;
			url += "api_key=" + GIPHY_KEY;

			//#4 - Parse text input, get .value of entered "search term"
			let term = document.querySelector("#searchterm").value;
			displayTerm = term;

			//#5 - URLS can't have spaces; get rid of them!
			term = term.trim();

			//#6 - Encode remaining special characters for valid URL
			term = encodeURIComponent(term);

			//#7 - Bail from function if there's no search term (no shame)
			if (term.length < 1) return;

			//#8 - Add "search term" to URL ("q" is its param)
			url += "&q=" + term;

			//#9 - Grab search limit from <select>, append to URL
			let limit = document.querySelector("#limit").value;
			url += "&limit=" + limit;

			//#10 - Update UI with search term
			document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

			//#11 - log url!
			console.log(url);

			//Part VII. Downloading the data wiht XHR

			//#12 - Request data with custom function!
			getData(url);
		}

		function getData(url) {
			//Part VII.

			//#1 - Create new XHR (XML HTTP Request) object
			let xhr = new XMLHttpRequest();

			//#2 - Set onload handler (when data sucessfully loads)
			xhr.onload = dataLoaded;

			//#3 - Set onerror handler
			xhr.onerror = dataError;

			//#4 - Open connection + send request w/ "GET" HTTP method
			xhr.open("GET", url);
			xhr.send();
		}

		function dataLoaded(e) {
			//#5 - event.target is the XHR obj; get ref back to XHR after loading
			let xhr = e.target;

			//#6 - .responseText is downloaded JSON file, log out to console
			console.log(xhr.responseText);


			//Part VIII. Formatting the results for the user

			//#7 - Turn JSON text to JavaScript object
			let obj = JSON.parse(xhr.responseText);

			//#8 - Bail out if there are not results 
			if (!obj.data || obj.data.length === 0) {
				document.querySelector("#status").innerHTML = "<br>No results found for '" + displayTerm + "'</b>";
				return; //Bail out
			}

			//#9 - Start building HTML string to show to user
			let results = obj.data;
			console.log("results.length = " + results.length);
			let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

			//#10 - Loop thru array of results
			for (let i = 0; i < results.length; i++) {
				let result = results[i];

				//#11 - Get URL to GIF in an <img> tag
				let smallURL = result.images.fixed_width_small.url;
				if (!smallURL) smallURL = "images/no-image-found.png";

				//#12 - Grab Giphy page URL, which will later be a link
				let url = result.url;

				//#13 - Build <div> for each result
				let line = `<div class="result"><img src="${smallURL}" title="${result.id}"/>`;
				line += `<span><a target="_blank" href="${url}">View on Giphy</a>\nRating: ${result.rating.toUpperCase()}</span></div>`;
			
				//#14 - The old way for old lame-os B)

				//#15 - Add <div> to bigString and loop
					bigString += line;
			}
			//#16 - We built the HTML...show it to the user!
			document.querySelector("#content").innerHTML = bigString;

			//#17 - Update the <div> for #status
			document.querySelector("#status").innerHTML = "<br>Success!</b>";
		}

		function dataError(e) {
			console.log("An error occurred");
		}