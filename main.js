const width = document.getElementsByTagName('body')[0].offsetWidth;
const height = document.getElementsByTagName('body')[0].offsetHeight;;

const drag = simulation => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

const corona_num = 20;
let nodes = [{ id: 0, group: 0 }] //, { id: 1, group: "eyes"}, { id: 2, group: "eyes"} ]; //body & eyes
let links = [];
// links.push({ source: 0, target: 1, value: 0 });
// links.push({ source: 0, target: 2, value: 0 });
for (let i = 3; i < corona_num+3; i++) {
  nodes.push({ id: i, gorup: 2 })
  links.push({ source: 0, target: i, value: 1 });
}

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links)
    .id(d => d.id)
    .distance(100)
  )
  .force("charge", d3.forceManyBody()
    .strength(-10)
  )
  .force("collide", d3.forceCollide()
    .strength(1)
    .radius(corona_num-5)
  )
  // .force("center", d3.forceCenter(width / 2, height / 2));

const svg = d3.select("svg");

const link = svg.append("g")
    .attr("stroke", "#E60268")
  .selectAll("line")
  .data(links)
  .join("line")
    .attr("stroke-width", d => d.value*5);

const node = svg.append("g")
    .attr("stroke", "#E60268")
    .attr("stroke-width", 1)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
    .attr("r", d => (d.id === 0) ? 80 : 10)
    .attr("fill", d => (d.group === "eyes") ? "white" : "#E60268")
    .call(drag(simulation));

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x + width / 2)
    .attr("y1", d => d.source.y + height / 2)
    .attr("x2", d => d.target.x + width / 2)
    .attr("y2", d => d.target.y + height / 2);

  node
    .attr("cx", d => d.x + width / 2)
    .attr("cy", d => d.y + height / 2);
});