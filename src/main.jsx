import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const questions = [
  {
    id: 1, section: "Math", skill: "Linear equations", subskill: "Solving one-variable equations", difficulty: "Medium",
    prompt: "If 3x + 7 = 25, what is the value of x?",
    choices: ["4", "6", "8", "10"], answer: 1,
    explanation: "Subtract 7 from both sides to get 3x = 18, then divide by 3. Therefore, x = 6.",
  },
  {
    id: 2, section: "Reading & Writing", skill: "Transitions", subskill: "Logical relationships", difficulty: "Medium",
    prompt: "The first experiment produced an unexpected result. ___, the researchers repeated it with a larger sample.",
    choices: ["However", "Therefore", "For example", "Meanwhile"], answer: 1,
    explanation: "The second action follows logically from the unexpected result, so 'Therefore' fits.",
  },
  {
    id: 3, section: "Math", skill: "Percent", subskill: "Percent change", difficulty: "Easy",
    prompt: "A jacket priced at $80 is discounted by 25%. What is the sale price?",
    choices: ["$20", "$55", "$60", "$75"], answer: 2,
    explanation: "25% of $80 is $20, so the sale price is $60.",
  },
  {
    id: 4, section: "Reading & Writing", skill: "Grammar", subskill: "Subject-verb agreement", difficulty: "Medium",
    prompt: "The collection of paintings ___ displayed in the west gallery.",
    choices: ["are", "were", "is", "have been"], answer: 2,
    explanation: "The subject is the singular noun 'collection,' so 'is' agrees with the subject.",
  },
  {
    id: 5, section: "Math", skill: "Ratios", subskill: "Proportional relationships", difficulty: "Easy",
    prompt: "If 4 notebooks cost $12, how much do 7 notebooks cost at the same rate?",
    choices: ["$18", "$21", "$24", "$28"], answer: 1,
    explanation: "Each notebook costs $3, so 7 notebooks cost $21.",
  },
  {
    id: 6, section: "Reading & Writing", skill: "Boundaries", subskill: "Sentence boundaries", difficulty: "Medium",
    prompt: "The museum extended its hours; ___, attendance increased during the summer.",
    choices: ["as a result", "for instance", "in contrast", "nevertheless"], answer: 0,
    explanation: "The attendance increase is a result of the extended hours, so 'as a result' establishes the correct relationship.",
  },
];

const emptyProfile = { target: "1400", testDate: "", answers: {}, confidence: {}, started: false };

function loadProfile() {
  try { return { ...emptyProfile, ...JSON.parse(localStorage.getItem("p1600_profile") || "{}") }; }
  catch { return emptyProfile; }
}

function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [screen, setScreen] = useState(() => localStorage.getItem("p1600_screen") || "home");
  const [index, setIndex] = useState(0);
  const [confidenceChoice, setConfidenceChoice] = useState(null);

  const saveProfile = (next) => {
    setProfile(next);
    localStorage.setItem("p1600_profile", JSON.stringify(next));
  };

  const answers = profile.answers;
  const attempted = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(([id, a]) => a === questions.find(q => q.id === Number(id))?.answer).length;
  const accuracy = attempted ? Math.round(correct / attempted * 100) : 0;
  const current = questions[index];

  const skillStats = useMemo(() => {
    const stats = {};
    questions.forEach(q => {
      if (answers[q.id] === undefined) return;
      if (!stats[q.skill]) stats[q.skill] = { total: 0, correct: 0, section: q.section };
      stats[q.skill].total++;
      if (answers[q.id] === q.answer) stats[q.skill].correct++;
    });
    return Object.entries(stats).map(([skill, data]) => ({ skill, ...data, accuracy: Math.round(data.correct / data.total * 100) })).sort((a,b) => a.accuracy - b.accuracy);
  }, [answers]);

  const mistakes = questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.answer);
  const strengths = skillStats.filter(s => s.accuracy >= 80);
  const focus = skillStats.find(s => s.accuracy < 80) || skillStats[0];

  const go = (nextScreen) => { setScreen(nextScreen); localStorage.setItem("p1600_screen", nextScreen); };

  function beginPlan() {
    const next = { ...profile, started: true };
    saveProfile(next);
    go("diagnostic");
  }

  function answer(choice) {
    saveProfile({ ...profile, answers: { ...answers, [current.id]: choice } });
    setConfidenceChoice(null);
  }

  function saveConfidence(value) {
    setConfidenceChoice(value);
    saveProfile({ ...profile, confidence: { ...profile.confidence, [current.id]: value } });
  }

  function nextQuestion() {
    if (index < questions.length - 1) { setIndex(index + 1); setConfidenceChoice(null); }
    else go("profile");
  }

  function reset() {
    localStorage.removeItem("p1600_profile");
    localStorage.removeItem("p1600_screen");
    setProfile(emptyProfile); setIndex(0); setConfidenceChoice(null); setScreen("home");
  }

  return (
    <div className="app">
      <header className="nav">
        <button className="brand" onClick={() => go("home")}>PROJECT<span>1600</span></button>
        {screen !== "home" && <nav>
          <button onClick={() => go("dashboard")}>Dashboard</button>
          <button onClick={() => go("diagnostic")}>Diagnostic</button>
          <button onClick={() => go("profile")}>SAT Profile</button>
          <button onClick={() => go("mistakes")}>Mistakes</button>
        </nav>}
      </header>

      {screen === "home" && <main className="hero">
        <div className="eyebrow">ADAPTIVE SAT PREP</div>
        <h1>Stop studying everything.<br/><em>Study what you need.</em></h1>
        <p className="lead">Project1600 learns how you make mistakes, then turns that information into a study plan built around you.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => go("onboarding")}>Build my plan →</button>
          <button className="secondary" onClick={() => go("dashboard")}>Explore demo</button>
        </div>
        <div className="feature-row">
          <div><b>01</b><span>Diagnose</span><small>Find the skills costing you points.</small></div>
          <div><b>02</b><span>Adapt</span><small>Practice changes as you improve.</small></div>
          <div><b>03</b><span>Master</span><small>Turn mistakes into permanent gains.</small></div>
        </div>
      </main>}

      {screen === "onboarding" && <main className="card-page"><div className="card">
        <div className="eyebrow">STEP 1 OF 2</div><h2>Where are you trying to go?</h2>
        <p>We'll use your goal and timeline to shape your first diagnostic and study plan.</p>
        <label>Target score</label>
        <div className="score-options">{["1200","1300","1400","1500","1600"].map(s => <button className={profile.target === s ? "selected" : ""} onClick={() => saveProfile({ ...profile, target: s })} key={s}>{s}</button>)}</div>
        <label>Test date <span>(optional)</span></label><input type="date" value={profile.testDate} onChange={e => saveProfile({ ...profile, testDate: e.target.value })}/>
        <button className="primary wide" onClick={beginPlan}>Start my diagnostic →</button>
      </div></main>}

      {screen === "diagnostic" && <main className="practice">
        <div className="practice-top"><span>DIAGNOSTIC · QUESTION {index + 1} / {questions.length}</span><span>{current.section} · {current.difficulty}</span></div>
        <div className="question-card">
          <div className="skill">{current.skill}</div><h2>{current.prompt}</h2>
          <div className="choices">{current.choices.map((choice, i) => <button key={choice} className={answers[current.id] === i ? "choice selected" : "choice"} onClick={() => answer(i)}><span>{String.fromCharCode(65 + i)}</span>{choice}</button>)}</div>
          {answers[current.id] !== undefined && <div className={answers[current.id] === current.answer ? "feedback good" : "feedback bad"}>
            <strong>{answers[current.id] === current.answer ? "Correct." : "Not quite."}</strong><p>{current.explanation}</p>
            <div className="confidence"><span>How confident were you?</span>{["Low","Medium","High"].map(c => <button className={confidenceChoice === c || profile.confidence[current.id] === c ? "selected" : ""} onClick={() => saveConfidence(c)} key={c}>{c}</button>)}</div>
            <button className="primary" onClick={nextQuestion}>{index === questions.length - 1 ? "See my profile →" : "Next question →"}</button>
          </div>}
        </div>
      </main>}

      {screen === "profile" && <main className="dashboard">
        <div className="dash-head"><div><div className="eyebrow">YOUR SAT PROFILE</div><h2>Your first profile is ready.</h2><p>Project1600 is using your diagnostic results to identify where practice will have the most impact.</p></div><div className="goal"><small>TARGET</small><strong>{profile.target}</strong></div></div>
        <div className="metrics"><div><small>DIAGNOSTIC</small><strong>{accuracy}%</strong><span>{correct}/{attempted} correct</span></div><div><small>CONFIDENCE</small><strong>{Object.keys(profile.confidence).length}/{attempted}</strong><span>questions rated</span></div><div><small>MISTAKES</small><strong>{mistakes.length}</strong><span>to review</span></div></div>
        <section className="profile-grid">
          <div className="panel"><div className="eyebrow">SKILL MAP</div><h3>What we know so far</h3>{skillStats.length ? skillStats.map(s => <div className="skill-row" key={s.skill}><div><b>{s.skill}</b><span>{s.section}</span></div><strong>{s.accuracy}%</strong></div>) : <p>Complete the diagnostic to build your skill map.</p>}</div>
          <div className="panel"><div className="eyebrow">FIRST PRIORITY</div><h3>{focus ? focus.skill : "Complete your diagnostic"}</h3><p>{focus ? `Your current accuracy here is ${focus.accuracy}%. Project1600 will use this as a starting point for targeted practice.` : "Your results will determine what you practice next."}</p><button className="primary" onClick={() => go("dashboard")}>View my plan →</button></div>
        </section>
      </main>}

      {screen === "dashboard" && <main className="dashboard">
        <div className="dash-head"><div><div className="eyebrow">PERSONALIZED DASHBOARD</div><h2>Good morning.</h2><p>{attempted ? "Your plan is adapting to what you know and what still needs work." : "Start your diagnostic so Project1600 can build your first plan."}</p></div><div className="goal"><small>TARGET</small><strong>{profile.target}</strong></div></div>
        <div className="metrics"><div><small>DIAGNOSTIC</small><strong>{attempted ? `${accuracy}%` : "Not taken"}</strong><span>{attempted ? `${correct}/${attempted} correct` : "Start your first set"}</span></div><div><small>QUESTIONS</small><strong>{attempted}</strong><span>completed</span></div><div><small>FOCUS</small><strong>{focus ? focus.skill : "Diagnostic"}</strong><span>next priority</span></div></div>
        <section className="next-card"><div><div className="eyebrow">RECOMMENDED NEXT</div><h3>{attempted ? `Practice ${focus?.skill || "your priority skill"}` : "Take your diagnostic"}</h3><p>{attempted ? `Your current plan starts with ${focus?.skill || "targeted practice"}. We'll keep updating it as new evidence comes in.` : "A short original question set will establish your starting profile."}</p></div><button className="primary" onClick={() => go(attempted ? "mistakes" : "diagnostic")}>{attempted ? "Review my data →" : "Start diagnostic →"}</button></section>
        {attempted && <section className="panel plan"><div className="eyebrow">TODAY'S PLAN</div><h3>30-minute focus block</h3><div className="plan-items"><div><b>10 min</b><span>Review {focus?.skill || "priority skills"}</span></div><div><b>10 min</b><span>Practice targeted questions</span></div><div><b>10 min</b><span>Review mistakes and confidence</span></div></div></section>}
      </main>}

      {screen === "mistakes" && <main className="dashboard"><div className="eyebrow">MISTAKE DNA</div><h2>Your mistakes are data.</h2><p>We track the reason behind a miss so the next practice set can respond to it.</p>{mistakes.length ? mistakes.map(q => <div className="mistake" key={q.id}><div><b>{q.skill}</b><span>{q.section} · {q.difficulty}</span></div><p><strong>Missed:</strong> {q.choices[answers[q.id]]} · <strong>Correct:</strong> {q.choices[q.answer]}</p><p>{q.explanation}</p><small>Initial classification: needs review · Confidence: {profile.confidence[q.id] || "not recorded"}</small></div>) : <div className="empty">No mistakes to review yet. Keep practicing.</div>}</main>}

      {screen !== "home" && <footer><button onClick={reset}>Reset demo data</button><span>Project1600 v0.2 · Diagnostic engine prototype</span></footer>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
