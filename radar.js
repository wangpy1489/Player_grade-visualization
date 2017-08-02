/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function RadarChart(id, data, options) {
    var cfg = {
        w: 1000,                //Width of the circle
        h: 1000,                //Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 80}, //The margins of the SVG
        levels: 5,                //How many levels or inner circles should there be drawn
        maxValue: 1,             //What is the value that the biggest circle will represent
        labelFactor: 1.25,     //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60,         //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35,     //The opacity of the area of the blob
        dotRadius: 3,             //The size of the colored circles of each blog
        opacityCircles: 0.1,     //The opacity of the circles of each blob
        strokeWidth: 1,         //The width of the stroke around each blob
        roundStrokes: false,    //If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scale.category10()    //Color function
    };
    var stander={
        goal: 1.14,  // 苏亚雷斯
        assist: 0.117, // 内马尔
        pass:1,      //内马尔
        steal:1.08,  //拉莫斯
        clearance:1.74  //拉莫斯

    }
    var team1_plyer=(team_b.map(function (i,j) {return i.name  }));
    var team2_plyer=(team_m.map(function (i,j) {return i.name  }));
    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
        }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = 1;

    var allAxis = (data[0].map(function(i, j){return i.axis})),    //Names of each axis
        total = allAxis.length,                    //The number of different axes
        radius = Math.min(100,cfg.w/2, cfg.h/2),     //Radius of the outermost circle
        Format = d3.format('%'),                 //Percentage formatting
        angleSlice = Math.PI * 2 / total;        //The width in radians of each "slice"

    //Scale for the radius
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar"+id);
    //Append a g element
    var g = svg.append("g")
        .attr("id","radar")
        .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

    var information=svg.append("g")
        .attr("id","information");

     var in_text=information.append("text")
        .attr("x",(cfg.w/2 + cfg.margin.left))
        .attr("y",cfg.h/2+cfg.margin.top+200)
        .attr("class","information")
         .text("Hello");

     var logo=svg.append("g")
         .append("image")
         .attr("x",675)
         .attr("y",100)
         .attr("width",400)
         .attr("height",400)
         .attr("xlink:href","image/Logo.png")
    var titile = svg.append("g")
        .append("text")
        .attr("x",870)
        .attr("y",550)
        .attr("class","title")
        .text("2015-16年")
    titile.append("tspan")
        .attr("x",titile.attr("x"))
        .attr("y",620)
        .text("赛季评分")


    /////////////////////////////////////////////////////////
    //////////// Player and team set           /////////////
    /////////////////////////////////////////////////////////



    var team1=svg.append("g")
        .attr("id","team1 ")


        team1.append("g")
            .append("text")
            .attr("x",200)
            .attr("y",50)
            .attr("class","team")
            .text("Barcelona");
       team1 .append("image")
        .attr("x",100)
        .attr("y",0)
        .attr("width",75)
        .attr("height",75)
        .attr("xlink:href","image/Barcelona.jpg")
        .on("mouseover",function(){
            information.select("text")
                .text("Barcelona")
        });

    var team1_players=team1.selectAll(".player")
        .data(team_b)
        .enter()
        .append("g")
        .append("image")
        .attr("xlink:href",function (d,i) {
            return "image/"+d.name+".jpg"
        })
        .attr("x",function (d,i) {
            if(i>5)
            {
                return 110*(i-6);
            }
            return 110*i;
        })
        .attr("y",function(d,i){
            if(i>5)
            {
                return 225;
            }
            return 100;
    })
        .on("mouseover", function(d,i) {

            g.selectAll(".radarWrapper")
                .remove();
            g.selectAll(".radarCircleWrapper")
                .remove();
            in_text.text("Barcelona");
            var player_infor = [d.name, "出场:" + d.appearance, "进球:" + d.goal, "助攻:" + d.assist, "关键球:" + d.key_pass, "抢断:" + d.steal, "解围:" + d.clearance];
            draw(grade(d));
            in_text.selectAll("tspan")
                .data(player_infor)
                .enter()
                .append("tspan")
                .attr("x", in_text.attr("x"))
                .attr("dy", "2em")
                .text(function (d, i) {
                    return d;
                })
        });

    var team2=svg.append("g")
        .attr("id","team2 ")

        team2.append("g")
        .append("text")
        .attr("x",200)
        .attr("y",420)
        .attr("class","team")
        .text("Real Madrid");

        team2.append("image")
        .attr("x",100)
        .attr("y",370)
        .attr("width",75)
        .attr("height",75)
        .attr("xlink:href","image/Real Madrid.jpg")
        .on("mouseover",function(){
            information.select("text")
                .text("Real Madrid")
        });

    var players2=team2.selectAll(".player")
        .data(team_m)
        .enter()
        .append("g")
        .append("image")
        .attr("xlink:href",function (d,i) {
            return "image/"+d.name+".jpg"
        })
        .attr("x",function (d,i) {
            if(i>5)
            {
                return 110*(i-6);
            }
            return 110*i;
        })
        .attr("y",function(d,i){
            if(i>5)
            {
                return 595;
            }
            return 470;
        })
        .on("mouseover", function(d,i){
            g.selectAll(".radarWrapper")
                .remove();
            g.selectAll(".radarCircleWrapper")
                .remove();

            in_text.text("Real Madrid");
            var player_infor=[d.name,"出场:"+d.appearance,"进球:"+d.goal,"助攻:"+d.assist,"关键球:"+d.key_pass,"抢断:"+d.steal,"解围:"+d.clearance];

            draw(grade(d));
            in_text.selectAll("tspan")
                .data(player_infor)
                .enter()
                .append("tspan")
                .attr("x",in_text.attr("x"))
                .attr("dy","2em")

                .text(function (d,i) {
                    return d;
                });

        });





    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d){return -d*radius/cfg.levels;})
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.1em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2)-5; })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2)-5; })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
function draw (ra_data) {
    //The radial line function
    var radarLine = d3.svg.line.radial()
        .interpolate("linear-closed")
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) {    return i*angleSlice; });

    if(cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }

    //Create a wrapper for the blobs
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(ra_data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

}


    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);


   /* var  information = svg.append("infor")
        .attr("class","legend")
        .attr( "x", (cfg.w/2+cfg.margin.left))
        .attr("y", (cfg.h/2+cfg.margin.top+200))
        .text("Hello")*/

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text
    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }//wrap

    function grade(d) {
        var appearance = parseInt(d.appearance);
        var goal = (parseInt(d.goal) / appearance) / stander.goal;
        var assist = (parseInt(d.assist) / appearance) / stander.assist;
        var key_pass = (parseInt(d.key_pass) / appearance) / stander.pass;
        var steal = (parseInt(d.steal) / appearance) / stander.steal;
        var clearance = (parseInt(d.clearance) / appearance) / stander.clearance;

        var attack = goal * 0.5 + assist * 0.3 + key_pass * 0.2;
        var horizon = key_pass * 0.7 + steal * 0.3;
        var defend = clearance * 0.7 + steal * 0.3;
        var skill = key_pass * 0.5 + assist * 0.2 + steal * 0.1 + goal * 0.2;
        var muilt = goal * 0.2 + assist * 0.2 + key_pass * 0.2 + steal * 0.2 + clearance * 0.2;

        var data = [
            [
                {axis: "进攻", value: attack},
                {axis: "意识", value: horizon},
                {axis: "防守", value: defend},
                {axis: "技术", value: skill},
                {axis: "多面", value: muilt},
                // {axis:"Large Screen",value:0.02},
                //{axis:"Price Of Device",value:0.21},
                //{axis:"To Be A Smartphone",value:0.50}
            ]
        ];
        return data;
    }
}//RadarChart