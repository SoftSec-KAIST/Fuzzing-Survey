// Art, Science, and Engineering of Fuzzing
//
// Copyright (C) 2019 Sang Kil Cha
//
// This program comes with ABSOLUTELY NO WARRANTY; for details see COPYING.md.
// This is free software, and you are welcome to redistribute it under certain
// conditions; see COPYING.md for details.

"use strict";

// When Miller et al. first published the seminal paper.
const theFirstYear = 1990;

// The heightr of each year bar.
const yearHeight = 100;

// The width of each year bar. Set this value big enough to handle many fuzzers!
const yearWidth = 100000;

function createCanvas(width, height) {
  return d3.select("#js-canvas")
    .append("svg")
      .attr("width", width)
      .attr("height", height);
}

function parseJSONData(arr) {
  let dict = {};
  var data = {
    "nodes": [],
    "links": []
  };
  $.each(arr, function (_, obj) {
    dict[obj.name] = obj;
    data.nodes.push(obj);
  });
  $.each(arr, function (_, obj) {
    if (obj.references !== undefined) {
      $.each(obj.references, function (_, ref) {
        data.links.push({ "source": obj.name, "target": ref });
      });
    }
  });
  return data;
}

function drawEdges(g, d) {
  return g.append("g")
    .selectAll("line")
    .data(d.links)
    .enter()
    .append("line")
      .classed("link", true);
}

function buildRef(node) {
  let s = "\"" + node.title + "\"";
  if (node.author !== undefined) {
    $.each(node.author, function (i, a) {
      if (i == node.author.length - 1 && node.author.length > 1)
        s += ", and " + a;
      else s += ", " + a;
    });
  }
  if (node.booktitle !== undefined) {
    s += ". In " + node.booktitle;
  }
  if (node.journal !== undefined) {
    s += ". " + node.journal + ", " + node.volume + "(" + node.number + ")";
  }
  if (node.year !== undefined) {
    s += ", " + node.year;
  }
  return s;
}

function appendPublication(list, node) {
  if (node.title !== undefined)
    list.append("li")
      .classed("list-group-item", true)
      .text(buildRef(node));
}

function constructIcon(faName, title) {
  return "<i class=\"fa " + faName + "\" title = \"" + title + "\"></i> ";
}

function appendToolURL(item, node) {
  if (node.toolurl !== undefined)
    item.append("a")
      .classed("infobox__icon", true)
      .attr("href", node.toolurl)
      .html(constructIcon("fa-wrench", "Tool available"));
}

function appendTargetInfo(item, node) {
  if (node.targets !== undefined)
    item
      .selectAll("span")
      .data(node.targets)
      .enter()
        .append("span")
        .classed("infobox__icon", true)
        .html(function (target) {
          switch (target) {
          case "file":
            return constructIcon("fa-file", "File fuzzing");
          case "network":
            return constructIcon("fa-wifi", "Network fuzzing");
          case "argument":
            return constructIcon("fa-font", "Argument fuzzing");
          case "kernel":
            return constructIcon("fa-bug", "Kernel fuzzing");
          default:
            return constructIcon("fa-question", "Other kinds of fuzzing");
          }
        });
}

function appendMiscURL(item, node) {
  if (node.miscurl !== undefined)
    item
      .selectAll("a")
      .data(node.miscurl)
      .enter()
        .append("a")
        .attr("href", function (url) { return url; })
        .classed("infobox__icon", true)
        .html(function (url) {
          return constructIcon("fa-link", url);
        });
}

function appendIcons(list, node) {
  const item = list.append("li").classed("list-group-item", true);
  appendToolURL(item, node);
  appendTargetInfo(item, node);
  appendMiscURL(item, node);
}

function getPubYear(node) {
  if (node.year !== undefined) return " (" + node.year + ")";
  else return "";
}

function setTitle(node) {
  const header = d3.select("#js-infobox-header");
  d3.select("#js-infobox-title")
    .text("[" + node.color + "] " + node.name + getPubYear(node));
  switch (node.color) {
    case "blackbox": header.classed("infobox-header-blackbox", true); break;
    case "whitebox": header.classed("infobox-header-whitebox", true); break;
    default: header.classed("infobox-header-greybox", true); break;
  }
}

function onClick(node) {
  let list =
    d3.select("#js-infobox-content").html("")
      .append("ul").classed("list-group", true);
  appendPublication(list, node);
  appendIcons(list, node);
  setTitle(node);
  $("#js-infobox").modal();
}

function drawNodes(g, d, simulation) {
  const nodes = g.append("g")
    .selectAll("rect")
    .data(d.nodes)
    .enter()
    .append("g");

  function dragStart(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragMiddle(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnd(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  nodes.append("ellipse")
    .attr("rx", 40)
    .attr("ry", 12)
    .attr("class", function (d) {
      switch (d.color) {
      case "blackbox": return "node node-blackbox";
      case "whitebox": return "node node-whitebox";
      default: return "node node-greybox";
      }
    })
    .on("click", onClick)
    .call(d3.drag()
            .on("start", dragStart)
            .on("drag", dragMiddle)
            .on("end", dragEnd));

  nodes.append("text")
    .attr("class", function (d) {
      switch (d.color) {
      case "blackbox": return "nodetext nodetext-blackbox";
      default: return "nodetext";
      }
    })
    .attr("dominant-baseline", "middle")
    .text(function (d) { return d.name })
    .on("click", onClick)
    .call(d3.drag()
            .on("start", dragStart)
            .on("drag", dragMiddle)
            .on("end", dragEnd));

  return nodes;
}

function installInfoboxHandler() {
  $("#js-infobox").draggable({ handle: ".modal-header" });
}

function computeMaxYear(d) {
  return d.reduce(function (acc, obj) {
    return Math.max(acc, obj.year);
  }, theFirstYear);
}

function installZoomHandler(height, canvas, g, d) {
  const maxX = yearWidth / 4;
  const maxY = (yearHeight + 2) * (computeMaxYear(d.nodes) - theFirstYear + 1);
  const marginY = height / 2;
  const zoomHandler =
    d3.zoom()
      .scaleExtent([0.2, 5])
      .translateExtent([[-maxX, -yearHeight - marginY], [maxX, maxY + marginY]])
      .on("zoom", function () {
        g.attr("transform", d3.event.transform)
      });
  zoomHandler(canvas);
  return zoomHandler;
}

function fieldMatch(field, re) {
  if (field !== undefined) return field.match(re);
  return false;
}

function clearSearchResults(nodes, resultList) {
  nodes.select(".node").classed("node-found", false);
  resultList.html("");
}

function installSearchHandler(width, height, canvas, zoom, nodes) {
  const txt = $("#js-searchform-text");
  const resultList = d3.select("#js-searchform-result");
  txt.click(function () { clearSearchResults(nodes, resultList); });
  txt.keyup(function (e) {
    if (e.shiftKey) return;
    const s = txt.val();
    const re = new RegExp(s, "i");
    clearSearchResults(nodes, resultList);
    if (s === "") return;
    const matches = nodes.filter(function (n) {
      return n.name.match(re)
        || fieldMatch(n.year.toString(), re)
        || fieldMatch(n.title, re)
        || fieldMatch(n.booktitle, re)
        || fieldMatch(n.journal, re)
        || (n.author !== undefined ? fieldMatch(n.author.join(" "), re) : false)
    });
    matches.select(".node").classed("node-found", true);
    const maxShow = 10;
    matches.each(function (d, i) {
      if (i >= maxShow) return;
      resultList.append("li")
        .classed("list-group-item", true)
        .classed("py-1", true)
        .text(d.name)
        .on("click", function () {
          const k = 1.0;
          const x = - d.x * k + width / 2;
          const y = - d.y * k + height / 2;
          canvas.transition().duration(750)
            .call(zoom.transform,
                  d3.zoomIdentity.translate(x, y).scale(k));
        });
    });
  });
}

function computeYPos(year) {
  return (year - theFirstYear) * yearHeight;
}

function ticked(links, nodes, simulation) {
  return function (e) {
    nodes.attr("transform", function (d) {
      d.y += (computeYPos(d.year) - d.y) * simulation.alpha();
      return "translate(" + d.x + "," + d.y + ")";
    });
    links
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });
  }
}

function initSimulation(d, simulation, width, height, links, nodes) {
  simulation
    .nodes(d.nodes)
    .force("link",
           d3.forceLink()
             .id(function (d) { return d.name; })
             .strength(function (link) {
               const diff = Math.abs(link.source.year - link.target.year);
               if (diff <= 0 ) return 0.5;
               else return 0.8;
             }))
    .force("charge", d3.forceManyBody().strength(-2000).distanceMax(500))
    .on("tick", ticked(links, nodes, simulation));

  simulation.force("link").links(d.links);
}

d3.json("data/fuzzers.json")
  .then(function(json) {
    const width = $("#js-canvas").width();
    const height = $("#js-canvas").height();
    const canvas = createCanvas(width, height);
    const simulation = d3.forceSimulation();
    const g = canvas.append("g");
    const d = parseJSONData(json);
    const links = drawEdges(g, d);
    const nodes = drawNodes(g, d, simulation);
    const zoom = installZoomHandler(height, canvas, g, d);
    installInfoboxHandler();
    installSearchHandler(width, height, canvas, zoom, nodes);
    initSimulation(d, simulation, width, height, links, nodes);
    zoom.scaleTo(canvas, 0.2);
  });
