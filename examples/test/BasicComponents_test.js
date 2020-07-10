// (C) 2007-2020 GoodData Corporation
import { Selector } from "testcafe";
import { config } from "./utils/config";
import { checkRenderChart, loginUserAndNavigate } from "./utils/helpers";

fixture("Basic components").beforeEach(loginUserAndNavigate(config.url));

const tooltipItem = Selector(".gd-viz-tooltip-item");
const tooltipValue = tooltipItem.find(".gd-viz-tooltip-value");
const tooltipTitle = tooltipItem.find(".gd-viz-tooltip-title");

test("Column chart should render", async t => {
    await checkRenderChart(".s-column-chart", t);
});

test("Bar chart should render", async t => {
    await checkRenderChart(".s-bar-chart", t);
});

test("Line chart should render", async t => {
    await checkRenderChart(".s-line-chart", t);
});

test("Line chart should have custom colors", async t => {
    const lineChart = Selector(".s-line-chart");
    const CUSTOM_COLORS = [
        "rgb(195, 49, 73)",
        "rgb(168, 194, 86)",
        "rgb(243, 217, 177)",
        "rgb(194, 153, 121)",
    ];

    await t.expect(lineChart.exists).ok();
    const legendIcons = lineChart.find(".series-icon");

    /* eslint-disable no-await-in-loop */
    for (let index = 0; index < CUSTOM_COLORS.length; index += 1) {
        await t
            .expect(await legendIcons.nth(index).getStyleProperty("background-color"))
            .eql(CUSTOM_COLORS[index]);
    }
    /* eslint-enable no-await-in-loop */
});

test("Pie chart should render", async t => {
    await checkRenderChart(".s-pie-chart", t);
});

test("Table should render", async t => {
    await checkRenderChart(".s-table", t);
});

test("KPI has correct number", async t => {
    const kpi = Selector(".gdc-kpi", { timeout: 20000 });
    await t
        .expect(kpi.exists)
        .ok()
        .expect(kpi.textContent)
        .eql("$92,556,577");
});

test("Donut chart should render", async t => {
    const donutChart = Selector(".s-donut-chart");
    await checkRenderChart(".s-donut-chart", t);

    const legend = donutChart.find(".viz-legend .series-item");
    const highchartsPoint = donutChart.find(".highcharts-series.highcharts-series-0 .highcharts-point");
    await t
        .hover(highchartsPoint.nth(2))
        .expect(tooltipTitle.textContent)
        .eql("$ Franchise Fees (Initial Franchise Fee)")
        .expect(tooltipValue.textContent)
        .eql("40,000")
        .expect(legend.nth(0).textContent)
        .eql("$ Franchise Fees (Ongoing Royalty)")
        .expect(legend.nth(1).textContent)
        .eql("$ Franchise Fees (Ad Royalty)")
        .expect(legend.nth(2).textContent)
        .eql("$ Franchise Fees (Initial Franchise Fee)");
});

test("Scatter plot should render", async t => {
    await checkRenderChart(".s-scatter-plot", t);
});

test("Bubble chart should render", async t => {
    await checkRenderChart(".s-bubble-chart", t);
});

test("Treemap should render", async t => {
    await checkRenderChart(".s-tree-map", t);
});

test("Headline should render", async t => {
    await checkRenderChart(".s-headline", t);
});

test("Heatmap should render", async t => {
    await checkRenderChart(".s-heat-map", t);
});

test("GeoPushpinChart should render", async t => {
    const geoPushpinChart = Selector(".s-geo-pushpin-chart-category");

    await t.expect(geoPushpinChart.exists).ok();
    await t.expect(geoPushpinChart.find("canvas").exists).ok();
});
