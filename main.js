const width = 600;
const height = 600;

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
let nodes = [{ id: 0, group: 0 }];
let links = [];
for (let i = 1; i <= corona_num; i++) {
  nodes.push({ id: i, gorup: 1 })
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
  .force("center", d3.forceCenter(width / 2, height / 2));

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
    .attr("r", d => (d.id == 0) ? 80 : 10)
    .attr("fill", "#E60268")
    .call(drag(simulation));

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
});