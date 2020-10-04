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

// The minimum scale that we can set.
const minScale = 0.2;

// The currently selected node's name.
var currentSelection = undefined;

function createCanvas(width, height) {
  return d3.select("#js-canvas")
    .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");
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

function buildAuthors(node) {
  let s = "";
  $.each(node.author, function (i, a) {
    if (i == node.author.length - 1 && node.author.length > 1)
      s += ", and " + a;
    else s += ", " + a;
  });
  return s;
}

function buildRef(node) {
  let s = "\"" + node.title + "\"";
  if (node.author !== undefined) {
    s += buildAuthors(node);
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

function appendPublicationOrCredit(list, node) {
  if (node.title !== undefined)
    list.append("li")
      .classed("list-group-item", true)
      .text(buildRef(node));
  else if (node.author !== undefined)
    list.append("li")
      .classed("list-group-item", true)
      .text(node.name + buildAuthors(node) + ", " + node.year);
}

function constructIcon(faName, title) {
  return "<i class=\"fa " + faName + "\" title = \"" + title + "\"></i> ";
}

function constructCharSpan(ch, title) {
  return "<i title = \"" + title + "\">" + ch + "</i> ";
}

function appendToolURL(list, node) {
  const item = list.append("li").classed("list-group-item", true);
  item.append("b").text("Tool URL: ");
  if (node.toolurl !== undefined)
    item.append("a")
      .classed("infobox__icon", true)
      .attr("href", node.toolurl)
      .html(constructIcon("fa-wrench", "Tool available"));
  else
    item.append("span").text("Not available.");
}

function appendTargetInfo(list, node) {
  const item = list.append("li").classed("list-group-item", true);
  item.append("b").text("Targets: ");
  if (node.targets !== undefined && node.targets.length > 0)
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
            return constructCharSpan("A", "Argument fuzzing");
          case "kernel":
            return constructCharSpan("K", "Kernel fuzzing");
          case "lib":
            return constructCharSpan("L", "Library fuzzing");
          default:
            return "<i title=\"" + target + "\">" + target + "</i> ";
          }
        });
  else
    item.append("span").text("Unknown");
}

function appendMiscURL(list, node) {
  const item = list.append("li").classed("list-group-item", true);
  item.append("b").text("Misc. URLs: ");
  if (node.miscurl !== undefined)
    $.each(node.miscurl, function (_, url) {
      item.append("a")
          .attr("href", url)
          .classed("infobox__icon", true)
          .html(constructIcon("fa-link", url));
    });
  else
    item.append("span").text("Not available.");
}

function appendSharableLink(list, node) {
  const item = list.append("li").classed("list-group-item", true);
  const url = location.protocol + "//" + location.host + location.pathname;
  item.append("b").text("Share: ");
  item.append("a").attr("href", url + "?k=" + node.name)
    .html(constructIcon("fa-share", node.name));
}

function getPubYear(node) {
  if (node.year !== undefined) return " (" + node.year + ")";
  else return "";
}

function setTitle(node) {
  const header = d3.select("#js-infobox-header");
  if (node === undefined) {
    d3.select("#js-infobox-title").text("Select a fuzzer");
  } else {
    d3.select("#js-infobox-title")
      .text("[" + node.color + "] " + node.name + getPubYear(node));
  }
}

function clearContents() {
  return d3.select("#js-infobox-content").html("");
}

function showInfobox() {
  d3.select("#js-infobox").style("display", "block");
}

function hideInfobox() {
  d3.select("#js-infobox").style("display", "none");
}

function onClick(node) {
  let list = clearContents().append("ul").classed("list-group", true);
  appendPublicationOrCredit(list, node);
  appendTargetInfo(list, node);
  appendToolURL(list, node);
  appendMiscURL(list, node);
  appendSharableLink(list, node);
  setTitle(node);
  currentSelection = node.name;
  showInfobox();
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
    d.isDragging = true;
  }

  function dragMiddle(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnd(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    d.isDragging = false;
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
    .on("click", onClick);

  const dragHandler = d3.drag()
    .on("start", dragStart)
    .on("drag", dragMiddle)
    .on("end", dragEnd);
  dragHandler(nodes);

  return nodes;
}

function computeMaxYear(d) {
  return d.reduce(function (acc, obj) {
    return Math.max(acc, obj.year);
  }, theFirstYear);
}

function installZoomHandler(height, canvas, g, d) {
  const maxX = yearWidth / 4;
  const maxY = (yearHeight + 2) * (computeMaxYear(d.nodes) - theFirstYear + 1);
  const marginY = height / 2 / minScale;
  const zoomHandler =
    d3.zoom()
      .scaleExtent([minScale, 5])
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

function arrayMatch(targets, re) {
  if (targets === undefined) return false;
  for (let i = 0; i < targets.length; i++) {
    if (fieldMatch(targets[i], re)) return true;
  }
  return false;
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function clearSearchResults(nodes, resultList) {
  nodes.select(".node").classed("node-found", function (node) {
    return (currentSelection === node.name);
  });
  resultList.html("");
}

function showFuzzer(node, nodes, zoom, canvas, width, height) {
  const resultList = d3.select("#js-searchform-result");
  const k = 2.0;
  const x = - node.x * k + width / 2;
  const y = - node.y * k + height / 2;
  onClick(node);
  clearSearchResults(nodes, resultList);
  canvas.transition().duration(750)
    .call(zoom.transform,
          d3.zoomIdentity.translate(x, y).scale(k));
}

function installSearchHandler(width, height, canvas, zoom, nodes) {
  const txt = $("#js-searchform-text");
  const resultList = d3.select("#js-searchform-result");
  txt.click(function (e) { clearSearchResults(nodes, resultList); });
  txt.keyup(function (e) {
    if (e.shiftKey) return;
    const s = escapeRegExp(txt.val());
    const re = new RegExp(s, "i");
    clearSearchResults(nodes, resultList);
    if (s === "") return;
    const matches = nodes.filter(function (n) {
      return n.name.match(re)
        || fieldMatch(n.year.toString(), re)
        || fieldMatch(n.title, re)
        || fieldMatch(n.booktitle, re)
        || fieldMatch(n.journal, re)
        || arrayMatch(n.targets, re)
        || arrayMatch(n.keywords, re)
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
          showFuzzer(d, nodes, zoom, canvas, width, height);
        });
    });
  });
}

function installClickHandler(nodes) {
  const resultList = d3.select("#js-searchform-result");
  $(document).on("click", "svg", function (evt) {
    clearSearchResults(nodes, resultList);
  });
}

function installDragHandler() {
  const infobox = d3.select("#js-infobox");
  $("#js-infobox").resizable({
    handles: { w: $("#js-separator") },
    resize: function (_e, ui) {
      const orig = ui.originalSize.width;
      const now = ui.size.width;
      const width = orig + orig - now;
      infobox.style("flex-basis", width + "px");
      infobox.style("width", null);
      infobox.style("height", null);
    }
  });
}

function installInfoBoxCloseHandler() {
  $("#js-infobox-close").click(function () { hideInfobox(); });
}

function computeYPos(year) {
  return (year - theFirstYear) * yearHeight;
}

function ticked(links, nodes, simulation) {
  return function (e) {
    nodes.attr("transform", function (d) {
      if (!d.isDragging) {
        d.y += (computeYPos(d.year) - d.y) * simulation.alpha();
      }
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

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return undefined;
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
    installSearchHandler(width, height, canvas, zoom, nodes);
    installClickHandler(nodes);
    installDragHandler();
    installInfoBoxCloseHandler();
    initSimulation(d, simulation, width, height, links, nodes);
    zoom.scaleTo(canvas, minScale);
    // Center the graph after a sec.
    setTimeout(function () {
      const key = getQueryVariable("k");
      const data = d.nodes.find(function (d) { return (d.name === key); });
      if (key === undefined || data === undefined) {
        const graphScale = d3.zoomTransform(g.node()).k;
        const y = height / 2 / graphScale;
        zoom.translateTo(canvas, 0, y);
      } else {
        setTimeout(function () {
          showFuzzer(data, nodes, zoom, canvas, width, height);
        }, 1000);
      }
    }, 500);
  });
