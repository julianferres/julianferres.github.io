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

  const phaseClass = (phase) => `phase-${phase.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;
  const svgNamespace = "http://www.w3.org/2000/svg";

  const svgElement = (tag, className, text) => {
    const element = document.createElementNS(svgNamespace, tag);
    if (className) element.setAttribute("class", className);
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const addChartTitle = (element, text) => {
    element.append(svgElement("title", "", text));
  };

  const renderMileageChart = (weeks) => {
    const width = 1120;
    const height = 380;
    const left = 52;
    const right = 12;
    const top = 52;
    const bottom = 342;
    const plotWidth = width - left - right;
    const plotHeight = bottom - top;
    const maxDistance = Math.max(...weeks.map((week) =>
      Math.max(week.plannedKm, week.actualKm || 0)
    ));
    const yMaximum = Math.ceil(maxDistance / 20) * 20;
    const slotWidth = plotWidth / weeks.length;
    const barWidth = Math.min(13, slotWidth * 0.28);
    const barGap = 3;
    const chart = svgElement("svg", "training-chart");
    chart.setAttribute("viewBox", `0 0 ${width} ${height}`);
    chart.setAttribute("role", "img");
    chart.setAttribute("aria-labelledby", "training-chart-title training-chart-description");
    chart.append(
      svgElement("title", "", "Weekly planned and recorded running mileage"),
      svgElement("desc", "", "Grouped bars compare planned weekly kilometres with recorded running kilometres. Recorded bars use the color of each training phase. Missing FIT weeks have no recorded bar.")
    );
    chart.children[0].setAttribute("id", "training-chart-title");
    chart.children[1].setAttribute("id", "training-chart-description");

    const phaseRuns = [];
    weeks.forEach((week, index) => {
      const previous = phaseRuns[phaseRuns.length - 1];
      if (previous && previous.phase === week.phase) {
        previous.end = index + 1;
      } else {
        phaseRuns.push({ phase: week.phase, start: index, end: index + 1 });
      }
    });

    phaseRuns.forEach(({ phase, start, end }) => {
      const band = svgElement("rect", `training-chart-phase-band ${phaseClass(phase)}`);
      band.setAttribute("x", `${left + start * slotWidth}`);
      band.setAttribute("y", `${top}`);
      band.setAttribute("width", `${(end - start) * slotWidth}`);
      band.setAttribute("height", `${plotHeight}`);
      chart.append(band);
      const label = svgElement("text", "training-chart-phase", phase);
      label.setAttribute("x", `${left + ((start + end) / 2) * slotWidth}`);
      label.setAttribute("y", "24");
      chart.append(label);
    });

    for (let distance = 0; distance <= yMaximum; distance += 20) {
      const y = bottom - (distance / yMaximum) * plotHeight;
      const grid = svgElement("line", "training-chart-grid");
      grid.setAttribute("x1", `${left}`);
      grid.setAttribute("x2", `${width - right}`);
      grid.setAttribute("y1", `${y}`);
      grid.setAttribute("y2", `${y}`);
      chart.append(grid);
      const label = svgElement("text", "training-chart-axis", `${distance}`);
      label.setAttribute("x", `${left - 10}`);
      label.setAttribute("y", `${y + 4}`);
      label.setAttribute("text-anchor", "end");
      chart.append(label);
    }

    weeks.forEach((week, index) => {
      const center = left + (index + 0.5) * slotWidth;
      const entries = [
        { value: week.plannedKm, className: "training-chart-planned", label: "planned" },
        { value: week.actualKm, className: `training-chart-actual ${phaseClass(week.phase)}`, label: "recorded" },
      ];

      entries.forEach((entry, seriesIndex) => {
        if (entry.value === null) return;
        const barHeight = (entry.value / yMaximum) * plotHeight;
        const x = center + (seriesIndex === 0 ? -barWidth - barGap / 2 : barGap / 2);
        const bar = svgElement("rect", entry.className);
        bar.setAttribute("x", `${x}`);
        bar.setAttribute("y", `${bottom - barHeight}`);
        bar.setAttribute("width", `${barWidth}`);
        bar.setAttribute("height", `${barHeight}`);
        bar.setAttribute("rx", "2");
        addChartTitle(bar, `Week ${week.week}: ${entry.label} ${entry.value.toFixed(2)} kilometres`);
        chart.append(bar);
      });

      const weekLabel = svgElement("text", "training-chart-week", `W${week.week}`);
      weekLabel.setAttribute("x", `${center}`);
      weekLabel.setAttribute("y", `${bottom + 18}`);
      chart.append(weekLabel);
    });

    const phases = [...new Set(weeks.map((week) => week.phase))];
    const legend = make("div", "training-phase-legend");
    const seriesLegend = make("div", "training-series-legend");
    [
      ["Planned", "planned"],
      ["Recorded running", "actual"],
    ].forEach(([label, type]) => {
      const item = make("span", "training-series-key");
      item.append(make("span", `training-series-swatch ${type}`), document.createTextNode(label));
      seriesLegend.append(item);
    });
    const phaseLegend = make("div", "training-phase-keys");
    phases.forEach((phase) => {
      phaseLegend.append(make("span", `training-phase-key ${phaseClass(phase)}`, phase));
    });
    legend.append(seriesLegend, phaseLegend);

    const wrapper = make("div", "training-chart-scroll");
    wrapper.append(chart);
    return { wrapper, legend };
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
    root.append(make("p", "training-note", "Compare scheduled weekly kilometres with recorded running distance. Background bands and recorded bars use a distinct color for each training phase; missing FIT data is shown as unavailable, not as zero."));
    const mileageChart = renderMileageChart(data.weeks);
    root.append(mileageChart.wrapper, mileageChart.legend);

    const weeks = make("div", "training-weeks");
    data.weeks.forEach((week) => {
      const colorClass = phaseClass(week.phase);
      const article = make("article", `training-week ${colorClass}`);
      const heading = make("div", "training-week-heading");
      const title = make("h3", "", `Week ${week.week}`);
      title.append(make("span", `training-phase ${colorClass}`, week.phase));
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
        const row = make("div", `training-bars${type === "actual" ? ` ${colorClass}` : ""}`);
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
      const colorClass = phaseClass(week.phase);
      calendar.append(make("div", `training-calendar-week ${colorClass}`, `W${week.week}`));
      const activities = new Map(week.days.map((day) => [day.date, day]));
      for (let offset = 0; offset < 7; offset += 1) {
        const date = new Date(`${week.start}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() + offset);
        const iso = date.toISOString().slice(0, 10);
        const activity = activities.get(iso);
        const beyondCoverage = iso > data.dataThrough;
        const cell = make("div", `training-day ${colorClass}${activity ? " has-activity" : ""}${beyondCoverage ? " no-data" : ""}`);
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
