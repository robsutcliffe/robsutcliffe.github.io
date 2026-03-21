'use client'

import React, { useEffect, useRef } from 'react'

// Color palette normalized
const COLORS = [
  [0x40 / 255, 0x17 / 255, 0x5f / 255], // 40175F
  [0x3a / 255, 0x2b / 255, 0x66 / 255], // 3A2B66
  [0x24 / 255, 0x2c / 255, 0x7b / 255], // 242C7B
  [0x27 / 255, 0x13 / 255, 0x74 / 255], // 271374
  [0x29 / 255, 0x14 / 255, 0x7e / 255], // 29147E
  [0x2a / 255, 0x15 / 255, 0x83 / 255], // 2A1583
  [0x2d / 255, 0x18 / 255, 0x91 / 255], // 2D1891
]

const ROTATION_SPEED = 0.4 // Speed in radians per second
const vertexShaderSource = `
  attribute vec2 a_base_position;
  attribute float a_theta_offset;
  attribute vec3 a_color;
  attribute float a_alpha;
  attribute float a_orbit_radius;

  uniform vec2 u_resolution;
  uniform float u_time;

  varying vec3 v_color;
  varying float v_alpha;

  void main() {
    // Current theta: base offset + time * speed
    float theta = a_theta_offset + u_time * ${ROTATION_SPEED}; 
    
    vec2 orbit = vec2(cos(theta), sin(theta)) * a_orbit_radius;
    vec2 position = a_base_position + orbit;

    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    gl_PointSize = 1.0; // Reduced point size to make line thinner
    v_color = a_color;
    v_alpha = a_alpha;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  varying vec3 v_color;
  varying float v_alpha;
  
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    // Draw simple circular points as specified by the lineThickness in p5 snippet
    if (dist > 0.5) {
      discard;
    }
    gl_FragColor = vec4(v_color, v_alpha);
  }
`

export default function CircleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      preserveDrawingBuffer: true,
    })
    if (!gl) return

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }

    const basePositionLoc = gl.getAttribLocation(program, 'a_base_position')
    const thetaOffsetLoc = gl.getAttribLocation(program, 'a_theta_offset')
    const colorLoc = gl.getAttribLocation(program, 'a_color')
    const alphaLoc = gl.getAttribLocation(program, 'a_alpha')
    const orbitRadiusLoc = gl.getAttribLocation(program, 'a_orbit_radius')

    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')

    const basePositionBuffer = gl.createBuffer()
    const thetaOffsetBuffer = gl.createBuffer()
    const colorBuffer = gl.createBuffer()
    const alphaBuffer = gl.createBuffer()
    const orbitRadiusBuffer = gl.createBuffer()

    let animationId: number
    const startTime = performance.now()

    let colorLoopIndex = 0

    const updateGrid = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      const radius = 60 // Increased from 40 to make orbits larger
      const colCount = Math.round(canvas.width / radius)
      const actualRadius = canvas.width / colCount
      const rowCount = Math.ceil(canvas.height / actualRadius)

      const basePositions: number[] = []
      const thetaOffsets: number[] = []
      const colors: number[] = []
      const alphas: number[] = []
      const orbitRadii: number[] = []

      // variance = 10 from snippet
      const variance = 10
      const xRandom = Math.random() * variance
      const yRandom = Math.random() * variance

      // Use a consistent color selection sequence to show progressive darkening
      for (let col = 0; col <= colCount; col++) {
        for (let row = 0; row <= rowCount; row++) {
          const x = col * actualRadius
          const y = row * actualRadius

          basePositions.push(x, y)

          // theta = x * xRandom + y * yRandom; from Circle constructor
          thetaOffsets.push(x * xRandom + y * yRandom)

          orbitRadii.push(actualRadius)

          // Even/Odd coloring like snippet
          const colorIdx = (col + row + colorLoopIndex) % COLORS.length
          const color = COLORS[colorIdx]
          colors.push(color[0], color[1], color[2])

          // Use higher alpha so it gets darker faster as we draw over it
          alphas.push(0.6)
        }
      }

      colorLoopIndex++

      gl.bindBuffer(gl.ARRAY_BUFFER, basePositionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(basePositions), gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, thetaOffsetBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thetaOffsets), gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alphas), gl.STATIC_DRAW)

      gl.bindBuffer(gl.ARRAY_BUFFER, orbitRadiusBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(orbitRadii), gl.STATIC_DRAW)

      return basePositions.length / 2
    }

    let pointCount = updateGrid()

    let lastLoopTime = 0
    const loopDuration = (2 * Math.PI) / ROTATION_SPEED

    const render = (now: number) => {
      const time = (now - startTime) / 1000

      // Check if we've completed a loop
      if (time - lastLoopTime > loopDuration) {
        lastLoopTime = time

        // Randomize the offsets for the next loop like the p5 snippet does
        pointCount = updateGrid()
      }

      gl.viewport(0, 0, canvas.width, canvas.height)
      // gl.clearColor(0, 0, 0, 0)
      // gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height)
      gl.uniform1f(timeLoc, time - lastLoopTime) // Reset time to 0 for each loop

      gl.bindBuffer(gl.ARRAY_BUFFER, basePositionBuffer)
      gl.enableVertexAttribArray(basePositionLoc)
      gl.vertexAttribPointer(basePositionLoc, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, thetaOffsetBuffer)
      gl.enableVertexAttribArray(thetaOffsetLoc)
      gl.vertexAttribPointer(thetaOffsetLoc, 1, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.enableVertexAttribArray(colorLoc)
      gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer)
      gl.enableVertexAttribArray(alphaLoc)
      gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, orbitRadiusBuffer)
      gl.enableVertexAttribArray(orbitRadiusLoc)
      gl.vertexAttribPointer(orbitRadiusLoc, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, pointCount)

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    const handleResize = () => {
      // Clear the canvas on resize to avoid messy trails during resizing
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      pointCount = updateGrid()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}
