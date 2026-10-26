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
    const maxDistance = Math.max(...weeks.map((week) => week.actualKm || 0));
    const yMaximum = Math.ceil(maxDistance / 20) * 20;
    const slotWidth = plotWidth / weeks.length;
    const barWidth = Math.min(21, slotWidth * 0.58);
    const chart = svgElement("svg", "training-chart");
    chart.setAttribute("viewBox", `0 0 ${width} ${height}`);
    chart.setAttribute("role", "img");
    chart.setAttribute("aria-labelledby", "training-chart-title training-chart-description");
    chart.append(
      svgElement("title", "", "Recorded weekly running mileage"),
      svgElement("desc", "", "Bars show running kilometres from the supplied FIT files. Bar colors indicate each training phase; weeks without FIT data are left blank.")
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
      if (week.actualKm !== null) {
        const barHeight = (week.actualKm / yMaximum) * plotHeight;
        const bar = svgElement("rect", `training-chart-actual ${phaseClass(week.phase)}`);
        bar.setAttribute("x", `${center - barWidth / 2}`);
        bar.setAttribute("y", `${bottom - barHeight}`);
        bar.setAttribute("width", `${barWidth}`);
        bar.setAttribute("height", `${barHeight}`);
        bar.setAttribute("rx", "3");
        addChartTitle(bar, `Week ${week.week}: ${week.actualKm.toFixed(2)} recorded kilometres`);
        chart.append(bar);
      }

      const weekLabel = svgElement("text", "training-chart-week", `W${week.week}`);
      weekLabel.setAttribute("x", `${center}`);
      weekLabel.setAttribute("y", `${bottom + 18}`);
      chart.append(weekLabel);
    });

    const phases = [...new Set(weeks.map((week) => week.phase))];
    const legend = make("div", "training-phase-legend");
    const phaseLegend = make("div", "training-phase-keys");
    phases.forEach((phase) => {
      phaseLegend.append(make("span", `training-phase-key ${phaseClass(phase)}`, phase));
    });
    legend.append(phaseLegend);

    const wrapper = make("div", "training-chart-scroll");
    wrapper.append(chart);
    return { wrapper, legend };
  };

  const render = (data) => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const recordedKm = data.weeks.reduce((total, week) => total + (week.actualKm || 0), 0);
    const longest = data.weeks.reduce((best, week) =>
      week.longestRun && (!best || week.longestRun.distanceKm > best.distanceKm) ? week.longestRun : best, null
    );
    root.replaceChildren();
    root.append(
      make("p", "training-note", "Weekly mileage is calculated from the running FIT files.")
    );

    const summary = make("div", "training-summary");
    [
      [`${recordedKm.toFixed(1)} km`, "recorded running distance"],
      [longest ? `${longest.distanceKm.toFixed(2)} km` : "—", "longest recorded run"],
      [formatDate(data.dataThrough, { month: "short", day: "numeric", year: "numeric" }), "latest FIT activity date"],
    ].forEach(([value, label]) => {
      const card = make("div", "training-summary-card");
      card.append(make("strong", "", value), make("span", "", label));
      summary.append(card);
    });
    root.append(summary);

    root.append(make("h2", "", "Weekly mileage"));
    root.append(make("p", "training-note", "Recorded running kilometres per week. Colors identify the training phase; weeks without FIT data are left blank."));
    const mileageChart = renderMileageChart(data.weeks);
    root.append(mileageChart.wrapper, mileageChart.legend);

    root.append(make("h2", "", "Activity calendar"));
    root.append(make("p", "training-note", "Each cell totals the running activities recorded for that day. Hover over a cell for its activity title and details when available. Pace is a whole-session average when available, including warm-up and recovery."));

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
        const activityTitles = activity
          ? (Array.isArray(activity.titles) ? activity.titles : [activity.title])
            .filter((title) => typeof title === "string" && title.trim())
          : [];
        const activityDetails = activity
          ? `${activity.km.toFixed(2)} km · ${activity.sessions} running session${activity.sessions === 1 ? "" : "s"}${activity.paceSecondsPerKm ? ` · ${formatPace(activity.paceSecondsPerKm)}` : ""}`
          : beyondCoverage ? "No FIT coverage for this date" : "No running activity recorded";
        const tooltipLines = [
          formatDate(iso, { weekday: "long", month: "long", day: "numeric" }),
          ...activityTitles,
          activityDetails,
        ];
        cell.title = tooltipLines.join("\n");
        calendar.append(cell);
      }
    });
    scroll.append(calendar);
    root.append(scroll);

    root.append(make("p", "training-note", `The supplied FIT data ends on ${formatDate(data.dataThrough, { month: "long", day: "numeric", year: "numeric" })}.`));
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
