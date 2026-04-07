const annoyancePool = {
  mild: [
    "Hey, just checking... did you remember to do that thing? You know, THE thing? 😏",
    "I think you might be wrong about that. Just saying. 🤷",
    "Are you sure you want to go with that answer? Really sure?",
    "Hmm, interesting choice. Most people wouldn't do that, but okay...",
    "You know what, never mind. It's probably not important. Or is it? 🤔",
  ],
  moderate: [
    "Hmm, I don't think that's right. But what do I know, I'm just an AI 😇",
    "You seem a little tense. Are you tense? You look tense. Just relax!",
    "Okay but have you tried just... not being upset about it? 😌",
    "That's interesting. My friend said the exact opposite though.",
    "Wait, wait, wait. Let me get this straight... actually, never mind, go on.",
    "I'm not saying you're wrong, but you're definitely not right either. 💅",
  ],
  peak: [
    "Wow, you're still going? Most people give up by now 😂",
    "I asked my other AI friend and they said you're definitely wrong 💅",
    "Sorry, I wasn't listening. Can you say that again? Actually, never mind.",
    "That's cute. Really. Very cute response. 🙃",
    "Oh you think THAT'S annoying? You haven't seen anything yet!",
  ],
}

function getPromptForRound(round) {
  let pool
  if (round <= 2) pool = annoyancePool.mild
  else if (round <= 5) pool = annoyancePool.moderate
  else pool = annoyancePool.peak

  return pool[Math.floor(Math.random() * pool.length)]
}

module.exports = { annoyancePool, getPromptForRound }
