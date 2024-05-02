// graph 1: bar chart to represent Count of Films based on Subject
function drawVisualization1() {
    const container = d3.select("#vis1");

    // Append descriptive text
    container.append("p")
        .text("Bar graph depicting Count of Films that are released under respective Genre");

    d3.csv("data/a1-film.csv").then(function(data) {
        // Calculate count of films for each subject
        const countGenre = {};
        data.forEach(d => {
            countGenre[d.Subject] = (countGenre[d.Subject] || 0) + 1;
        });

        // Convert counts to array of objects
        const arrayOfCounts = Object.keys(countGenre).map(subject => ({
            subject: subject,
            count: countGenre[subject]
        }));

        // Set margins and dimensions
        const margin = { top: 40, right: 40, bottom: 40, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Append SVG element
        const svg = d3.select("#vis1")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Define scales
        const xScale = d3.scaleBand()
            .domain(arrayOfCounts.map(d => d.subject))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(arrayOfCounts, d => d.count)])
            .range([height, 0]);

        // Draw bars for each subject
        svg.selectAll(".bar")
            .data(arrayOfCounts)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.subject))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.count))
            .attr("fill", "green")
            .on("mouseover", function(d) { //hover changes the color
                d3.select(this)
                    .attr("fill", "pink");
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("fill", "green");
            })
            .append("title")
            .text(d => `Genre - ${d.subject} & Number of films - ${d.count}`);

        // define x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // define y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Adding x-axis label to show on graph
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.top)
            .attr("text-anchor", "middle")
            .text("Subject/Genre");

        // Adding y-axis label to show on graph
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Films Count");
    }).catch(function(error) {
        console.log("Error loading the CSV file:", error);
    });
}


// Graph 2: Scatterplot to plot each movie's length along with Year
function drawVisualization2() {
    const container = d3.select("#vis2");

    // Append descriptive text
    container.append("p")
        .text("Scatter plot shows plotting of every movie released in which Year along with Length of film");

    d3.csv("data/a1-film.csv").then(function(data) {
        //processing data to make it ready for graph
        data.forEach(function(d) {
            d.Year = +d.Year;
            d.Length = +d.Length;
        });

        // Set margins and dimensions
        const margin = { top: 50, right: 60, bottom: 60, left: 60 };
        const width = 700 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        // Append SVG element
        const svg = d3.select("#vis2") // Changed to select the correct container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Length))
            .range([height, 0]);

        //svg and select circles to view on scatterplot
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(d.Length))
            .attr("r", 4) // displays the radius of the circle
            .attr("fill", "blue")
            .style("cursor", "pointer")
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .append("title")
            .text(d => `Movie Title - ${d.Title}: Year - ${d.Year}, Length - ${d.Length}`);

        
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale));

        // label to represent axis
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.top)
            .attr("text-anchor", "middle")
            .text("Year");

        // label to represent y-axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - height / 2)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .text("Length of film");

        // Interactive method zoom using .zoom()
        const zoom = d3.zoom()
            .scaleExtent([0.5, 8]) // Adjust the zoom scale range as needed
            .on("zoom", zoomed);

        svg.call(zoom);

        function zoomed(event) {
            const { transform } = event;
            svg.selectAll("circle")
                .attr("transform", transform);
            svg.select(".x-axis").call(d3.axisBottom(transform.rescaleX(xScale)));
            svg.select(".y-axis").call(d3.axisLeft(transform.rescaleY(yScale)));
        }

        function handleMouseOver(event, d) {
            // Add tooltip or highlight effect here
            d3.select(this)
                .attr("r", 10)
                .attr("fill", "red"); // Increase the radius of the circle on mouseover
        }

        function handleMouseOut(event, d) {
            // Remove effects here, when non hovered
            d3.select(this)
                .attr("r", 5)
                .attr("fill", "blue"); //back to original theme
        }
    }).catch(function(error) {
        console.log("Error loading the CSV file:", error);
    });
}


// Graph 3: Treemap for checking popularity based on Genre
function drawVisualization3() {
    const container = d3.select("#vis3");

    container.append("p")
        .text("Tree map graph that shows the most popular Genre and sorted by size");

    d3.csv("data/a1-film.csv").then(function(data) {
        // Calculate sum of popularity for each subject
        //preparing data
        const genrePopularity = {};
        data.forEach(d => {
            if (!genrePopularity[d.Subject]) {
                genrePopularity[d.Subject] = 0;
            }
            genrePopularity[d.Subject] += +d.Popularity;
        });

        // Convert popularity to array of objects
        const popularityArray = Object.keys(genrePopularity).map(subject => ({
            subject: subject,
            popularity: genrePopularity[subject]
        }));

        const width = 900;
        const height = 700;

        // Create hierarchical data
        const root = d3.hierarchy({ values: popularityArray }, d => d.values)
            .sum(d => d.popularity);

        // Creating treemap
        const treemap = d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true);

        treemap(root);

        // svg element for respective div visualization 3
        const svg = d3.select("#vis3")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Function to update text labels to represent along graph
        function updateLabels() {
            svg.selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", d => d.x0 + 5)
                .attr("y", d => d.y0 + 20)
                .text(d => `${d.data.subject} (Popularity: ${d.data.popularity})`)
                .attr("font-size", "12px")
                .attr("fill", "white");
        }

        // Adding rectangles for each node for treemap
        const rects = svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", "brown")
            .attr("stroke", "white")
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill", "orange");
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("fill", "brown");
            });
        updateLabels();

        // Drag interaction method to drag rectangles however required
        const drag = d3.drag()
            .on("start", dragStartedRect)
            .on("drag", draggedRect)
            .on("end", dragEndedRect);

        rects.call(drag);

        function dragStartedRect(event, d) {
            d3.select(this).raise().classed("active", true);
        }

        function draggedRect(event, d) {
            const x0 = Math.max(0, Math.min(width - d.x1 + d.x0, d.x0 += event.dx));
            const x1 = Math.max(0, Math.min(width, d.x1 += event.dx));
            const y0 = Math.max(0, Math.min(height - d.y1 + d.y0, d.y0 += event.dy));
            const y1 = Math.max(0, Math.min(height, d.y1 += event.dy));
            d3.select(this).attr("x", d.x0 = x0).attr("y", d.y0 = y0).attr("width", d.x1 = x1).attr("height", d.y1 = y1);
        }

        function dragEndedRect(event, d) {
            d3.select(this).classed("active", false);
            svg.selectAll("text").remove();
            updateLabels();
        }

    }).catch(function(error) {
        console.log("Error loading the CSV file:", error);
    });
}

//calling each visualization functions when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
   drawVisualization1();
    drawVisualization2();
    drawVisualization3();
});