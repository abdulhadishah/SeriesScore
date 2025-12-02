const CATEGORY_SETS = {
  Anime: [
    {
      label: "Story & Plot",
      tagline: "Narrative structure, pacing, and overall direction.",
    },
    {
      label: "Characters & Development",
      tagline: "Depth, growth, motivations, and chemistry.",
    },
    {
      label: "Art Style & Design",
      tagline: "Visual presentation, style consistency, and mood.",
    },
    {
      label: "Soundtrack & Voice Acting",
      tagline: "Music, sound design, and voice performance.",
    },
    {
      label: "Overall Enjoyment",
      tagline: "How much it held your attention and stayed with you.",
    },
  ],
  Manga: [
    {
      label: "Story & Plot",
      tagline: "Narrative flow, pacing, and use of chapters.",
    },
    {
      label: "Characters & Development",
      tagline: "Depth, growth, relationships, and dynamics.",
    },
    {
      label: "Art Style & Paneling",
      tagline: "Panel layout, clarity, and visual storytelling.",
    },
    {
      label: "Worldbuilding & Setting",
      tagline: "World detail, consistency, and sense of place.",
    },
    {
      label: "Overall Enjoyment",
      tagline: "How invested you were while reading.",
    },
  ],
  Novel: [
    {
      label: "Story & Pacing",
      tagline: "Structure, progression, and overall momentum.",
    },
    {
      label: "Characters & Development",
      tagline: "Depth, inner life, and growth over time.",
    },
    {
      label: "Writing Quality & Description",
      tagline: "Prose clarity, imagery, and tone.",
    },
    {
      label: "Worldbuilding & Setting",
      tagline: "Detail, logic, and immersion of the setting.",
    },
    {
      label: "Overall Enjoyment",
      tagline: "How strongly it resonated with you.",
    },
  ],
};

// labels based on selected medium
function updateCategoryLabels() {
  const medium = document.getElementById("mediaType").value;
  const set = CATEGORY_SETS[medium];

  if (!set) return;

  for (let i = 0; i < 5; i++) {
    const labelEl = document.getElementById(`label-${i + 1}`);
    const helperEl = document.getElementById(`tagline-${i + 1}`);
    if (!labelEl || !helperEl) continue;

    const emojiSpan = labelEl.querySelector(".emoji");
    const emojiHTML = emojiSpan ? emojiSpan.outerHTML : "";
    labelEl.innerHTML = `${emojiHTML} ${set[i].label}`;
    helperEl.textContent = set[i].tagline;
  }
}

// input validation
function sanitizeScore(inputEl, errorEl) {
  let raw = inputEl.value.trim();

  if (raw === "") {
    errorEl.textContent = "Please enter a score between 0 and 10.";
    inputEl.style.borderColor = "#b91c1c";
    return null;
  }

  if (isNaN(raw)) {
    errorEl.textContent = "Score must be a number between 0 and 10.";
    inputEl.style.borderColor = "#b91c1c";
    return null;
  }

  let value = parseFloat(raw);

  // round to nearest integer
  value = Math.round(value);

  if (value > 10) {
    value = 10;
    errorEl.textContent = "Adjusted to 10 (maximum allowed).";
  } else if (value < 0) {
    value = 0;
    errorEl.textContent = "Adjusted to 0 (minimum allowed).";
  } else {
    errorEl.textContent = "";
  }

  inputEl.value = value.toString();
  inputEl.style.borderColor = "#c4c7d4";
  return value;
}

// comment based on average score
function getComment(avg) {
  if (avg < 2) return "Very weak overall; hard to recommend.";
  if (avg < 4) return "Below average; many elements don’t quite land.";
  if (avg < 6) return "A mixed experience with a few standout moments.";
  if (avg < 7.5)
    return "Solid overall, with clear strengths and noticeable flaws.";
  if (avg < 8.5) return "Well-crafted and engaging for most of its run.";
  if (avg < 9.5) return "A standout title that does a lot right.";
  return "Exceptional — polished, memorable, and easy to recommend.";
}

function openPopup(mediumLabel, avgScore, scores) {
  const popupBg = document.getElementById("popupBackground");
  const popupMedium = document.getElementById("popupMedium");
  const popupScore = document.getElementById("popupScore");
  const popupComment = document.getElementById("popupComment");
  const popupBreakdown = document.getElementById("popupBreakdown");

  popupMedium.textContent = mediumLabel;
  popupScore.textContent = `${avgScore}/10`;
  popupComment.textContent = getComment(avgScore);

  const mediumKey = document.getElementById("mediaType").value;
  const config = CATEGORY_SETS[mediumKey];
  let breakdownHtml = "";

  config.forEach((cat, index) => {
    breakdownHtml += `
      <div class="popup-breakdown-item">
        <span>${cat.label}</span>
        <span>${scores[index]}</span>
      </div>`;
  });

  popupBreakdown.innerHTML = breakdownHtml;

  popupBg.style.display = "flex";
}

function closePopup() {
  const popupBg = document.getElementById("popupBackground");
  popupBg.style.display = "none";
}

// main
document.addEventListener("DOMContentLoaded", function () {
  const mediaTypeEl = document.getElementById("mediaType");
  const submitButton = document.getElementById("submitButton");
  const closePopupButton = document.getElementById("closePopupButton");
  const popupBg = document.getElementById("popupBackground");

  // update labels on load
  updateCategoryLabels();
  mediaTypeEl.addEventListener("change", updateCategoryLabels);

  for (let i = 1; i <= 5; i++) {
    const inputEl = document.getElementById(`score-${i}`);
    const errorEl = document.getElementById(`error-${i}`);
    if (!inputEl || !errorEl) continue;

    inputEl.addEventListener("blur", function () {
      sanitizeScore(inputEl, errorEl);
    });
  }

  // submit
  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    const scores = [];
    let valid = true;

    for (let i = 1; i <= 5; i++) {
      const inputEl = document.getElementById(`score-${i}`);
      const errorEl = document.getElementById(`error-${i}`);
      const value = sanitizeScore(inputEl, errorEl);
      if (value === null) valid = false;
      scores.push(value);
    }

    if (!valid) return;

    // score average
    const sum = scores.reduce((total, val) => total + val, 0);
    const avg = Math.round(sum / scores.length);

    const mediumFullLabel = mediaTypeEl.options[mediaTypeEl.selectedIndex].text;

    openPopup(mediumFullLabel, avg, scores);
  });

  // close pop-up
  closePopupButton.addEventListener("click", closePopup);
  popupBg.addEventListener("click", function (e) {
    if (e.target === popupBg) {
      closePopup();
    }
  });
});
