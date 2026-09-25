import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const questions = [
  {
    id: 1, section: "Math", skill: "Linear equations", difficulty: "Medium",
    prompt: "If 3x + 7 = 25, what is the value of x?",
    choices: ["4", "6", "8", "10"], answer: 0,
    explanation: "Subtract 7 from both sides to get 3x = 18, then divide by 3."
  },
  {
    id: 2, section: "Reading & Writing", skill: "Transitions", difficulty: "Medium",
    prompt: "The first experiment produced an unexpected result. ___, the researchers repeated it with a larger sample.",
    choices: ["However", "Therefore", "For example", "Meanwhile"], answer: 1,
    explanation: "The second action follows logically from the unexpected result, so 'Therefore' fits."
  },
  {
    id: 3, section: "Math", skill: "Percent", difficulty: "Easy",
    prompt: "A jacket priced at $80 is discounted by 25%. What is the sale price?",
    choices: ["$20", "$55", "$60", "$75"], answer: 2,
    explanation: "25% of $80 is $20, so the sale price is $60."
  },
  {
    id: 4, section: "Reading & Writing", skill: "Grammar", difficulty: "Medium",
    prompt: "The collection of paintings ___ displayed in the west gallery.",
    choices: ["are", "were", "is", "have been"], answer: 2,
    explanation: "The subject is the singular noun 'collection,' so 'is' agrees with it."
  }
];

function App() {
  const [screen, setScreen] = useState("home");
  const [goal, setGoal] = useState(() => localStorage.getItem("p1600_goal") || "1400");
  const [testDate, setTestDate] = useState(() => localStorage.getItem("p1600_date") || "");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem("p1600_answers") || "{}"));
  const [confidence, setConfidence] = useState(null);

  useEffect(() => localStorage.setItem("p1600_answers", JSON.stringify(answers)), [answers]);

  const correct = Object.entries(answers).filter(([id, a]) => a === questions.find(q => q.id === Number(id))?.answer).length;
  const attempted = Object.keys(answers).length;
  const accuracy = attempted ? Math.round(correct / attempted * 100) : 0;

  const current = questions[index];

  function start() {
    localStorage.setItem("p1600_goal", goal);
    localStorage.setItem("p1600_date", testDate);
    setScreen("dashboard");
  }

  function answer(choice) {
    setAnswers(prev => ({ ...prev, [current.id]: choice }));
    setConfidence(null);
  }

  function next() {
    if (index < questions.length - 1) setIndex(index + 1);
    else setScreen("dashboard");
  }

  return (
    <div className="app">
      <header className="nav">
        <button className="brand" onClick={() => setScreen("home")}>PROJECT<span>1600</span></button>
        {screen !== "home" && (
          <nav>
            <button onClick={() => setScreen("dashboard")}>Dashboard</button>
            <button onClick={() => setScreen("practice")}>Practice</button>
            <button onClick={() => setScreen("mistakes")}>Mistakes</button>
          </nav>
        )}
      </header>

      {screen === "home" && (
        <main className="hero">
          <div className="eyebrow">ADAPTIVE SAT PREP</div>
          <h1>Stop studying everything.<br/><em>Study what you need.</em></h1>
          <p className="lead">Project1600 learns how you make mistakes, then turns that information into a study plan built around you.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setScreen("onboarding")}>Build my plan →</button>
            <button className="secondary" onClick={() => setScreen("dashboard")}>Explore demo</button>
          </div>
          <div className="feature-row">
            <div><b>01</b><span>Diagnose</span><small>Find the skills costing you points.</small></div>
            <div><b>02</b><span>Adapt</span><small>Practice changes as you improve.</small></div>
            <div><b>03</b><span>Master</span><small>Turn mistakes into permanent gains.</small></div>
          </div>
        </main>
      )}

      {screen === "onboarding" && (
        <main className="card-page">
          <div className="card">
            <div className="eyebrow">LET'S PERSONALIZE THIS</div>
            <h2>Where are you trying to go?</h2>
            <p>We'll use this information to build your first study plan.</p>
            <label>Target score</label>
            <div className="score-options">
              {["1200","1300","1400","1500","1600"].map(s =>
                <button className={goal === s ? "selected" : ""} onClick={() => setGoal(s)} key={s}>{s}</button>
              )}
            </div>
            <label>Test date <span>(optional)</span></label>
            <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} />
            <button className="primary wide" onClick={start}>Create my dashboard →</button>
          </div>
        </main>
      )}

      {screen === "dashboard" && (
        <main className="dashboard">
          <div className="dash-head">
            <div><div className="eyebrow">YOUR SAT PROFILE</div><h2>Good morning.</h2><p>Here's what Project1600 thinks you should work on next.</p></div>
            <div className="goal"><small>TARGET</small><strong>{goal}</strong></div>
          </div>
          <div className="metrics">
            <div><small>DIAGNOSTIC</small><strong>{attempted ? `${accuracy}%` : "Not taken"}</strong><span>{attempted ? `${correct}/${attempted} correct` : "Start your first set"}</span></div>
            <div><small>QUESTIONS</small><strong>{attempted}</strong><span>completed</span></div>
            <div><small>FOCUS</small><strong>{attempted ? "Review" : "Diagnostic"}</strong><span>next action</span></div>
          </div>
          <section className="next-card">
            <div><div className="eyebrow">RECOMMENDED NEXT</div><h3>{attempted ? "Review your mistakes" : "Take your diagnostic"}</h3><p>{attempted ? "You have questions to review. Understanding why you missed them is more valuable than simply seeing the answer." : "A short original question set will establish your starting profile."}</p></div>
            <button className="primary" onClick={() => setScreen(attempted ? "mistakes" : "practice")}>{attempted ? "Review mistakes →" : "Start diagnostic →"}</button>
          </section>
        </main>
      )}

      {screen === "practice" && (
        <main className="practice">
          <div className="practice-top"><span>QUESTION {index + 1} / {questions.length}</span><span>{current.section} · {current.difficulty}</span></div>
          <div className="question-card">
            <div className="skill">{current.skill}</div>
            <h2>{current.prompt}</h2>
            <div className="choices">
              {current.choices.map((choice, i) => (
                <button key={choice} className={answers[current.id] === i ? "choice selected" : "choice"} onClick={() => answer(i)}>
                  <span>{String.fromCharCode(65 + i)}</span>{choice}
                </button>
              ))}
            </div>
            {answers[current.id] !== undefined && (
              <div className={answers[current.id] === current.answer ? "feedback good" : "feedback bad"}>
                <strong>{answers[current.id] === current.answer ? "Correct." : "Not quite."}</strong>
                <p>{current.explanation}</p>
                <div className="confidence"><span>How confident were you?</span>{["Low","Medium","High"].map(c => <button className={confidence === c ? "selected" : ""} onClick={() => setConfidence(c)} key={c}>{c}</button>)}</div>
                <button className="primary" onClick={next}>{index === questions.length - 1 ? "Finish set →" : "Next question →"}</button>
              </div>
            )}
          </div>
        </main>
      )}

      {screen === "mistakes" && (
        <main className="dashboard">
          <div className="eyebrow">MISTAKE REVIEW</div>
          <h2>Your mistakes are data.</h2>
          <p>Project1600 will eventually classify each miss by the reason behind it—not just the topic.</p>
          {questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.answer).map(q =>
            <div className="mistake" key={q.id}><div><b>{q.skill}</b><span>{q.section}</span></div><p>{q.explanation}</p></div>
          )}
          {!questions.some(q => answers[q.id] !== undefined && answers[q.id] !== q.answer) && <div className="empty">No mistakes to review yet. Keep practicing.</div>}
        </main>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
