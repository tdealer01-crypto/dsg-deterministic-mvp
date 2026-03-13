import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simulation state for the DSG Algorithm
  let currentState = {
    t: 0,
    S_t: [0.5, 0.5, 0.5],
    S_star: [0.5, 0.5, 0.5],
    drift: 0,
    oscillation: 0,
    entropy: 0.12,
    prediction: [] as any[],
    matrix: Array(4).fill(0).map(() => Array(4).fill(0).map(() => Math.random())),
    decision: "ALLOW",
    history: [] as any[]
  };

  // API to get current algorithm state
  app.get("/api/algo/state", (req, res) => {
    res.json(currentState);
  });

  // API to simulate a step
  app.post("/api/algo/step", (req, res) => {
    const { inputState } = req.body;
    
    // Formal Logic Simulation
    const t = currentState.t + 1;
    const S_t = currentState.S_t;
    const S_star = currentState.S_star;
    const S_hat = inputState || S_t.map(v => v + (Math.random() - 0.5) * 0.15);

    // 1. Drift Calculation
    const norm = (vec: number[]) => Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    const diff = S_hat.map((v, i) => v - S_star[i]);
    const drift = norm(diff) / (norm(S_star) || 1);

    // 2. Entropy (Futuristic Metric)
    const entropy = Math.abs(Math.sin(t * 0.1) * 0.2 + drift * 0.5 + Math.random() * 0.05);

    // 3. Prediction (Next 5 steps)
    const prediction = Array(5).fill(0).map((_, i) => ({
        t: t + i + 1,
        drift: Math.max(0, drift + (Math.random() - 0.4) * 0.1 * (i + 1))
    }));

    // 4. Matrix Evolution
    const matrix = currentState.matrix.map(row => row.map(v => Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.1))));

    // 5. Oscillation
    const prevDiff = currentState.history.length > 0 ? 
      currentState.history[currentState.history.length - 1].diff : diff;
    let oscillation = 0;
    for(let i=0; i<diff.length; i++) {
        if (Math.sign(diff[i]) !== Math.sign(prevDiff[i])) oscillation++;
    }

    // 6. Gate Function Logic
    let decision = "ALLOW";
    if (drift > 0.45) decision = "STABILIZE";
    if (drift > 0.85 || oscillation > 3) decision = "BLOCK";

    // 7. Commit Semantics
    let nextS = S_hat;
    if (decision === "STABILIZE") nextS = S_star;
    if (decision === "BLOCK") nextS = S_t;

    currentState = {
      t,
      S_t: nextS,
      S_star,
      drift,
      oscillation,
      entropy,
      prediction,
      matrix,
      decision,
      history: [...currentState.history, { t, drift, oscillation, entropy, decision, diff }].slice(-50)
    };

    res.json(currentState);
  });

  // Reset simulation
  app.post("/api/algo/reset", (req, res) => {
    currentState = {
      t: 0,
      S_t: [0.5, 0.5, 0.5],
      S_star: [0.5, 0.5, 0.5],
      drift: 0,
      oscillation: 0,
      entropy: 0.12,
      prediction: [],
      matrix: Array(4).fill(0).map(() => Array(4).fill(0).map(() => Math.random())),
      decision: "ALLOW",
      history: []
    };
    res.json(currentState);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
