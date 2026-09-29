(() => {
  const challenges = [
    { title: 'Broken access control', category: 'ACCESS CONTROL', prompt: 'A fictional profile page accepts an account number in the URL. What should the server do before returning that profile?', box: 'GET /demo/profile?account=1042\nSigned-in viewer: account 1041', options: ['Check on the server that the viewer is authorized for account 1042.', 'Hide the account number field in the browser interface.', 'Assume the visitor only changes the URL by mistake.'], answer: 0, explanation: 'Authorization must be checked server-side for every requested object. Unpredictable IDs and hidden controls are not authorization.' },
    { title: 'Injection risk', category: 'INPUT & QUERIES', prompt: 'A mock search handler builds a database query by joining the search text into a query string. Which design reduces injection risk?', box: 'QUERY TEMPLATE: SELECT title FROM notes WHERE tag = [search text]', options: ['Use a parameterized query and treat the search term as data.', 'Remove a few punctuation characters in the browser.', 'Hide database errors while keeping the query construction.'], answer: 0, explanation: 'Parameterized queries keep query structure separate from user data. Client-side filtering alone cannot protect a server-side query.' },
    { title: 'Cross-site scripting (XSS)', category: 'OUTPUT HANDLING', prompt: 'A note contains text from a visitor and is shown on a shared page. What is the safer rendering choice?', box: 'SAVED NOTE: visitor-provided text\nRENDER MODE: interpret as HTML', options: ['Render it as text and apply context-appropriate output encoding.', 'Trust it because the note was stored in the application database.', 'Remove angle brackets using a quick string replacement.'], answer: 0, explanation: 'Stored content remains untrusted. Render as text where possible and use context-aware encoding or a well-maintained sanitizer when HTML is required.' },
    { title: 'Request forgery (CSRF)', category: 'SESSION SAFETY', prompt: 'A signed-in user’s browser can be induced to submit a state-changing request. Which control belongs in the defense?', box: 'MOCK ACTION: change account email\nSESSION: cookie-based', options: ['Use an unpredictable CSRF token and validate request origin where appropriate.', 'Rely on a confirmation button rendered by the page.', 'Put the session identifier in a URL parameter.'], answer: 0, explanation: 'CSRF defenses validate that a state-changing request came through an expected flow. SameSite cookies help, but should be part of a considered design.' },
    { title: 'Authentication weakness', category: 'IDENTITY', prompt: 'A login service accepts unlimited password attempts. Which improvement is most appropriate?', box: 'FICTIONAL LOGIN POLICY\nATTEMPTS: unlimited\nFEEDBACK: detailed account existence', options: ['Apply rate limits with progressive delays and generic failure messages.', 'Force every user to choose a very short password.', 'Lock accounts permanently after one incorrect attempt.'], answer: 0, explanation: 'Rate limits and progressive delays help slow guessing while generic errors reduce account enumeration. Avoid permanent lockouts that attackers can abuse.' },
    { title: 'Security misconfiguration', category: 'DEPLOYMENT', prompt: 'A demo web service is configured to show detailed diagnostic traces to every visitor. What should happen in production?', box: 'MOCK RESPONSE\n500 Internal Error\nDiagnostic details: visible to requester', options: ['Return a generic error and keep detailed diagnostics in access-controlled server logs.', 'Show the full trace so visitors can report the exact code path.', 'Remove all error handling to avoid displaying a message.'], answer: 0, explanation: 'Public responses should not disclose internals. Keep necessary diagnostics in appropriately protected logs and avoid logging secrets.' },
    { title: 'Sensitive data exposure', category: 'DATA PROTECTION', prompt: 'A mock API response includes more account information than the current screen needs. What is the better approach?', box: 'SCREEN NEEDS: display name\nRESPONSE ALSO INCLUDES: private contact and recovery fields', options: ['Return only fields needed for this view and protect sensitive data in transit and at rest.', 'Send everything and hide unused fields with CSS.', 'Rename sensitive fields so they look less obvious.'], answer: 0, explanation: 'Minimize data at the source. Hiding fields in the interface does not remove them from the response or protect them.' },
    { title: 'Server-side request forgery (SSRF)', category: 'OUTBOUND REQUESTS', prompt: 'A service fetches a URL supplied by a user. What is a safer design for this feature?', box: 'MOCK FEATURE: fetch a remote image by URL\nDESTINATION: user supplied', options: ['Restrict destinations with an allowlist and block private or local address ranges after resolving redirects.', 'Allow every URL because the browser supplied it.', 'Check only that the text begins with “https”.'], answer: 0, explanation: 'Server-side fetches need destination controls, redirect revalidation, careful DNS/IP handling, and response limits. A scheme check alone is insufficient.' },
    { title: 'Vulnerable dependencies', category: 'SUPPLY CHAIN', prompt: 'A project uses an old dependency with a known security update. What is a sound maintenance step?', box: 'DEPENDENCY NOTICE\nInstalled: older release\nSecurity fix: available upstream', options: ['Review the advisory, update to a supported fixed version, and run relevant checks.', 'Ignore the notice if the site appears to work.', 'Download a similarly named package from an unknown mirror.'], answer: 0, explanation: 'Use trusted package sources, review the advisory and compatibility, update to a fixed supported version, then validate the application.' },
    { title: 'Insufficient logging and monitoring', category: 'DETECTION & RESPONSE', prompt: 'A service needs to record failed sign-in events. Which log entry is useful and safer?', box: 'EVENT: failed authentication\nLOGGING POLICY: under review', options: ['Record time, event type, and a suitably minimized account reference; never record the password or session token.', 'Record the submitted password to help reproduce the event.', 'Store the complete authentication cookie with every request.'], answer: 0, explanation: 'Security logs should support detection while minimizing sensitive data. Never log passwords, tokens, or full authentication cookies.' },
  ];

  const list = document.querySelector('#challenge-list');
  const solved = new Set();
  let streak = 0;
  let bestStreak = 0;
  let score = 0;
  const cards = challenges.map((challenge, index) => {
    const card = document.createElement('details'); card.className = 'challenge-card';
    const summary = document.createElement('summary');
    const number = document.createElement('span'); number.className = 'challenge-number'; number.textContent = String(index + 1).padStart(2, '0');
    const heading = document.createElement('span'); heading.className = 'challenge-heading';
    const title = document.createElement('strong'); title.textContent = challenge.title;
    const category = document.createElement('small'); category.textContent = challenge.category;
    heading.append(title, category);
    const status = document.createElement('span'); status.className = 'challenge-status'; status.textContent = 'READY';
    const chevron = document.createElement('span'); chevron.className = 'challenge-chevron'; chevron.textContent = '+';
    summary.append(number, heading, status, chevron);

    const body = document.createElement('div'); body.className = 'challenge-body';
    const prompt = document.createElement('p'); prompt.textContent = challenge.prompt;
    const mock = document.createElement('div'); mock.className = 'mock-box';
    const mockLabel = document.createElement('div'); mockLabel.className = 'mock-box-label'; mockLabel.textContent = 'FICTIONAL SCENARIO / NO LIVE SYSTEM';
    const data = document.createElement('div'); data.className = 'mock-data'; data.textContent = challenge.box;
    mock.append(mockLabel, data);
    const choices = document.createElement('div'); choices.className = 'challenge-choices'; choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', `${challenge.title} answers`);
    const feedback = document.createElement('div'); feedback.className = 'challenge-feedback'; feedback.setAttribute('aria-live', 'polite');
    const hint = document.createElement('div'); hint.className = 'challenge-hint'; hint.textContent = 'Choose the safest practical control. Your score is kept only until you leave or reset this page.';
    let shuffledOptions = [];
    let lastCorrectPosition = -1;
    function shuffleAnswers() {
      const makeOrder = () => challenge.options.map((text, originalIndex) => ({ text, originalIndex, key: Math.random() })).sort((a, b) => a.key - b.key);
      shuffledOptions = makeOrder();
      let position = shuffledOptions.findIndex((item) => item.originalIndex === challenge.answer);
      while (position === lastCorrectPosition && challenge.options.length > 1) {
        shuffledOptions = makeOrder();
        position = shuffledOptions.findIndex((item) => item.originalIndex === challenge.answer);
      }
      lastCorrectPosition = position;
    }
    function renderAnswers() {
      shuffleAnswers();
      choices.replaceChildren();
      shuffledOptions.forEach((option, optionIndex) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'challenge-choice';
        const mark = document.createElement('span'); mark.className = 'choice-mark'; mark.textContent = String.fromCharCode(65 + optionIndex);
        const label = document.createElement('span'); label.textContent = option.text;
        button.append(mark, label);
        button.addEventListener('click', () => {
          if (solved.has(index) || card.dataset.answered === 'true') return;
          card.dataset.answered = 'true';
          choices.querySelectorAll('button').forEach((item) => { item.disabled = true; });
          if (option.originalIndex === challenge.answer) {
            solved.add(index); status.textContent = 'SOLVED'; status.classList.add('done');
            streak += 1; bestStreak = Math.max(bestStreak, streak); score += streak === 1 ? 100 : 100 + Math.min(streak - 1, 5) * 20;
            feedback.textContent = `Correct. +${streak === 1 ? 100 : 100 + Math.min(streak - 1, 5) * 20} points · ${streak} in a row. ${challenge.explanation}`; feedback.className = 'challenge-feedback good';
            button.classList.add('correct'); mark.textContent = '✓';
          } else {
            streak = 0;
            button.classList.add('incorrect'); mark.textContent = '×';
            feedback.textContent = `Not quite. The best choice was ${String.fromCharCode(65 + shuffledOptions.findIndex((item) => item.originalIndex === challenge.answer))}. ${challenge.explanation}`;
            feedback.className = 'challenge-feedback try';
            const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'challenge-next retry-challenge'; retry.textContent = 'Try again with shuffled answers';
            retry.addEventListener('click', () => {
              delete card.dataset.answered; feedback.textContent = ''; feedback.className = 'challenge-feedback';
              renderAnswers(); choices.querySelector('button')?.focus();
              retry.remove();
            });
            feedback.append(document.createElement('br'), retry);
          }
          updateProgress();
        });
        choices.append(button);
      });
    }
    renderAnswers();
    body.append(prompt, mock, choices, feedback, hint); card.append(summary, body); list.append(card); return card;
  });
  function updateProgress() {
    const count = solved.size; document.querySelector('#score-count').textContent = `${count} / 10`;
    document.querySelector('#progress-fill').style.width = `${count * 10}%`;
    document.querySelector('#score-points').textContent = `${score} PTS`;
    document.querySelector('#score-streak').textContent = `${streak} STREAK`;
    document.querySelector('#challenge-result').classList.toggle('show', count === challenges.length);
    if (count === challenges.length) {
      document.querySelector('#result-score').textContent = `${score} points · best streak ${bestStreak}.`;
    }
  }
  document.querySelector('#expand-all').addEventListener('click', () => cards.forEach((card) => { card.open = true; }));
  document.querySelector('#collapse-all').addEventListener('click', () => cards.forEach((card) => { card.open = false; }));
  document.querySelector('#reset-game').addEventListener('click', () => window.location.reload());
  document.querySelectorAll('.challenge-next').forEach((button) => button.addEventListener('click', () => {
    if (button.id === 'play-again') { document.querySelector('#reset-game').click(); cards[0].open = true; cards[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const next = cards.find((card) => !solved.has(cards.indexOf(card)));
    if (next) { next.open = true; next.scrollIntoView({ behavior: 'smooth', block: 'center' }); next.querySelector('.challenge-choice:not(:disabled)')?.focus({ preventScroll: true }); }
  }));
})();

