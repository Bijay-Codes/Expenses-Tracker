# Track Talk — Case Study

**Stack:** Vanilla JavaScript, HTML, CSS, Chart.js, Day.js, localStorage  
**Live:** [track-talker.vercel.app](https://track-talker.vercel.app) &nbsp;|&nbsp; **Repo:** [github.com/Bijay-Codes/Expenses-Tracker](https://github.com/Bijay-Codes/Expenses-Tracker)

---

## Where It Started

I wanted to build something that wasn't just another CRUD app sitting in a GitHub repo that nobody opens. Expense trackers exist everywhere — so I figured the only way to make it worth building was to make it mean something. Not just log your expenses but actually watch how you interact with them.

The idea was simple: if you keep editing your expenses, you're probably lying to yourself. If you keep deleting them, you're definitely lying to yourself. The app should know that. And it should say something about it.

That became the roast engine.

---

## The Roast Engine

Every add, edit, and delete gets tracked silently. Then three ratios get computed:

| Ratio | What It's Looking For |
|---|---|
| `editCount / addCount` | How indecisive you are |
| `deleteCount / addCount` | How much you're hiding |
| `(editCount + deleteCount) / addCount` | Full chaos |

Each ratio has three tiers of roasts that escalate based on how bad your numbers are. Tier 1 is a nudge. Tier 3 is basically an intervention. They cycle on a random timer so they don't go stale sitting on the page.

On top of that, the monthly roasts page scans your tags for red-flag keywords — things like `Regret`, `Impulse`, `YOLO` — and has its own separate roast tier system based on how often you've used them. Because apparently tagging something as `Total waste` six times in a month means something.

---

## The 24-Hour Lock

After 24 hours, edit and delete lock. You can see the expense. You can't touch it.

Without this, the whole roast engine falls apart — users would just delete every bad purchase and the behavioral data becomes noise. This wasn't a technical decision, it was a product one. I wanted the data to actually mean something, which meant the user couldn't just clean up their history whenever it got uncomfortable.

It's also just honest. Your spending history is your spending history.

---

## The Part I'm Actually Proud Of

The roast content and the roast logic live in two separate files — `Roastbase.js` is just data, `RoastData.js` is the engine that reads behavior and decides what to show. If I want to tune how harsh it gets or add new tiers, I only touch one file.

That was the first time I consciously applied separation of concerns as a design decision rather than something I just read about and nodded at.

---

## Looking Back At It Now

Honestly? The code has problems. Not broken — it works and it's deployed — but looking at it now I can see the seams.

Managing UI state by manually toggling `.hidden` classes and directly touching the DOM everywhere is the kind of thing that starts feeling painful fast. I was basically reinventing React in the messiest way possible. Every re-render is a function that wipes innerHTML and rebuilds everything from scratch. It works until it doesn't.

Event listeners getting attached multiple times, edit state living in a module-level variable, the modal managing its own visibility through CSS classes — these are the exact problems React exists to solve. State lives in one place, the UI reacts to it, and you stop writing `document.querySelector` forty times per file.

Tailwind would have cut the CSS files in half too. A lot of the utility classes I wrote by hand are just Tailwind classes with extra steps.

If I built this today it'd be React, Tailwind, `useState` for the edit modal and active expense, and probably a `useReducer` for the roast scores. Half the code, same result, way less to debug.

But I built it in vanilla JS because that's where I was, and I'd do it the same way again for the same reason — you don't really understand what a tool solves until you've felt the problem it's solving.
