const WIDTH = 1000
const HEIGHT = 100
const ITERATIONS = 6
const ROUGHNESS = 0.8

generate()
document.getElementById('regen').addEventListener('click', generate)

async function generate() {
  const dividerSvg = await divider('')
  document.getElementById('result').innerHTML = dividerSvg
}

// mountain divider
async function divider(classes) {
  const segments = Math.pow(2, ITERATIONS)
  const points = line(WIDTH, displaceMap(HEIGHT, HEIGHT / 4, ROUGHNESS, segments))
  const path = convertPath(WIDTH, HEIGHT, points)
  const svg = genSvg(WIDTH, HEIGHT, path)

  return `
    <div class="b-divider ${classes}" role="img" aria-hidden="true">
      ${svg}
    </div>
  `
}

// generate midpoint displacement points
function displaceMap(height, displace, roughness, power) {
  const points = []

  // set initial left point
  points[0] = height / 2 + (Math.random() * displace * 2) - displace

  // set initial right point
  points[power] = height / 2 + (Math.random() * displace * 2) - displace
  displace *= roughness

  // increase number of segments to maximum
  for (let i = 1; i < power; i *= 2) {
    // for each segment, find centre point
    for (let j = (power / i) / 2; j < power; j += power / i) {
      points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2)
      points[j] += (Math.random() * displace * 2) - displace
    }

    // reduce random range
    displace *= roughness
  }

  return points
}

// format points in [x, y] array
function line(width, points) {
  const sep = width / (points.length - 1)
  return points.map((val, i) => ([
    i * sep,
    val
  ]))
}

// convert points into SVG path
function convertPath(width, height, points) {
  // add first M (move) command
  const first = points.shift()
  let path = `M ${first[0]} ${first[1]}`

  // iterate through points adding L (line) commands to path
  points.forEach(val => {
    path += ` L ${val[0]} ${val[1]}`
  })

  // close path
  path += ` L ${width} ${height} L 0 ${height} Z`

  return path
}

// generate SVG from path
function genSvg(width, height, path) {
  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="${path}"></path>
    </svg>
  `
}