(() => {
  const root = document.getElementById("training-dashboard");
  if (!root) return;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const formatDate = (value, options) =>
    new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
      ...options,
      timeZone: "UTC",
    });

  const formatPace = (seconds) => {
    if (!Number.isFinite(seconds)) return "";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.round(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}/km`;
  };

  const render = (data) => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const maxKm = Math.max(...data.weeks.map((week) =>
      Math.max(week.plannedKm, week.actualKm || 0)
    ));
    const coveredWeeks = data.weeks.filter((week) => week.coverage === "available").length;
    const partialWeeks = data.weeks.filter((week) => week.coverage === "partial").length;

    root.replaceChildren();
    root.append(
      make("p", "training-note", "Planned totals come from the training spreadsheet. Recorded totals use running sessions in the supplied FIT files; they are a useful comparison, not a perfect like-for-like measure.")
    );

    const summary = make("div", "training-summary");
    [
      [`${data.plannedTotalKm.toLocaleString("en-US")} km`, "planned across 23 weeks"],
      [`${data.peakPlannedWeek} km`, `peak planned week · w${data.weeks.find((week) => week.plannedKm === data.peakPlannedWeek).week}`],
      [`${coveredWeeks} full + ${partialWeeks} partial`, "weeks with FIT coverage"],
      [formatDate(data.dataThrough, { month: "short", day: "numeric", year: "numeric" }), "latest FIT activity date"],
    ].forEach(([value, label]) => {
      const card = make("div", "training-summary-card");
      card.append(make("strong", "", value), make("span", "", label));
      summary.append(card);
    });
    root.append(summary);

    root.append(make("h2", "", "Weekly mileage"));
    root.append(make("p", "training-note", "Grey shows the scheduled weekly total; orange shows recorded running distance. Missing FIT data is shown as unavailable, not as zero."));

    const weeks = make("div", "training-weeks");
    data.weeks.forEach((week) => {
      const article = make("article", "training-week");
      const heading = make("div", "training-week-heading");
      const title = make("h3", "", `Week ${week.week}`);
      title.append(make("span", "training-phase", week.phase));
      heading.append(title, make("span", "training-status",
        week.coverage === "available" ? "FIT data available" :
          week.coverage === "partial" ? "Partial FIT coverage" : "No FIT data"
      ));
      article.append(heading);
      article.append(make("p", "training-week-meta",
        `${formatDate(week.start, { month: "short", day: "numeric" })}–${formatDate(week.end, { month: "short", day: "numeric" })}`
      ));

      const bars = make("div", "");
      [
        ["Planned", week.plannedKm, "planned"],
        ["Recorded", week.actualKm, "actual"],
      ].forEach(([label, value, type]) => {
        const row = make("div", "training-bars");
        row.append(make("span", "", label));
        const track = make("div", `training-track training-track-${type}`);
        track.setAttribute("role", "img");
        track.setAttribute("aria-label", value === null ? `${label}: no FIT data` : `${label}: ${value.toFixed(2)} kilometres`);
        const fill = make("span", "");
        fill.style.width = value === null ? "0%" : `${Math.min(100, (value / maxKm) * 100)}%`;
        track.append(fill);
        row.append(track, make("strong", "", value === null ? "—" : `${value.toFixed(1)} km`));
        bars.append(row);
      });
      article.append(bars);
      weeks.append(article);
    });
    root.append(weeks);

    root.append(make("h2", "", "Activity calendar"));
    root.append(make("p", "training-note", "Each cell totals the running activities recorded for that day. Pace is a whole-session average when available, including warm-up and recovery."));

    const scroll = make("div", "training-calendar-scroll");
    const calendar = make("div", "training-calendar");
    calendar.setAttribute("role", "grid");
    calendar.append(make("div", "training-calendar-heading", "Week"));
    daysOfWeek.forEach((day) => calendar.append(make("div", "training-calendar-heading", day)));

    data.weeks.forEach((week) => {
      calendar.append(make("div", "training-calendar-week", `W${week.week}`));
      const activities = new Map(week.days.map((day) => [day.date, day]));
      for (let offset = 0; offset < 7; offset += 1) {
        const date = new Date(`${week.start}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() + offset);
        const iso = date.toISOString().slice(0, 10);
        const activity = activities.get(iso);
        const beyondCoverage = iso > data.dataThrough;
        const cell = make("div", `training-day${activity ? " has-activity" : ""}${beyondCoverage ? " no-data" : ""}`);
        cell.setAttribute("role", "gridcell");
        const weekday = daysOfWeek[offset];
        cell.append(make("span", "training-day-label", `${weekday} ${date.getDate()}`));
        cell.append(make("span", "training-day-distance",
          activity ? `${activity.km.toFixed(1)} km` : beyondCoverage ? "No data" : "—"
        ));
        const details = activity
          ? `${activity.sessions} running session${activity.sessions === 1 ? "" : "s"}${activity.paceSecondsPerKm ? ` · ${formatPace(activity.paceSecondsPerKm)}` : ""}`
          : beyondCoverage ? "No FIT coverage for this date" : "No running activity recorded";
        cell.title = `${formatDate(iso, { weekday: "long", month: "long", day: "numeric" })}: ${activity ? `${activity.km.toFixed(2)} km · ${details}` : details}`;
        calendar.append(cell);
      }
    });
    scroll.append(calendar);
    root.append(scroll);

    root.append(make("p", "training-note", `Activity summaries only; GPS routes are not included. Supplied FIT data ends on ${formatDate(data.dataThrough, { month: "long", day: "numeric", year: "numeric" })}.`));
  };

  fetch(root.dataset.source)
    .then((response) => {
      if (!response.ok) throw new Error(`Training data request failed (${response.status})`);
      return response.json();
    })
    .then(render)
    .catch((error) => {
      console.error("Training dashboard failed to load.", error);
      root.replaceChildren(make("p", "", "The training dashboard could not load its data. Please try again later."));
    });
})();
