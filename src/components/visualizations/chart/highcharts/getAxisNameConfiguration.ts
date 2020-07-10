// (C) 2019-2020 GoodData Corporation
import get = require("lodash/get");
import { IAxis, IAxisNameConfig, IChartOptions } from "../../../../interfaces/Config";
import { XAxisTitleOptions, YAxisTitleOptions } from "highcharts";
import { isOneOfTypes } from "../../utils/common";
import { VisualizationTypes } from "../../../../constants/visualizationTypes";
import { ROTATE_NEGATIVE_90_DEGREES, ALIGN_LEFT, ALIGN_RIGHT } from "../../../../constants/axisLabel";

type HighchartsAxisTitle = XAxisTitleOptions | YAxisTitleOptions;

const axisNameConfigGetter = (chartOptions: IChartOptions) => (axisNamePrefix: string) =>
    get(chartOptions, `${axisNamePrefix}Axes`, []).map((axis: IAxis) => {
        if (!axis) {
            return {};
        }

        return {
            title: getHighchartsAxisTitleConfiguration(chartOptions, axis, axisNamePrefix),
        };
    });

function getHighchartsAxisTitleConfiguration(
    chartOptions: IChartOptions,
    axis: IAxis,
    axisNamePrefix: string,
): HighchartsAxisTitle {
    const isYAxis = axisNamePrefix === "y";
    const opposite = get(axis, "opposite", false);
    const axisPropsKey = opposite
        ? `secondary_${axisNamePrefix}AxisProps.name`
        : `${axisNamePrefix}AxisProps.name`;
    const axisNameConfig: IAxisNameConfig = get(chartOptions, axisPropsKey, {});
    const title: HighchartsAxisTitle = {};

    if (axisNameConfig.position) {
        title.align = axisNameConfig.position; // low | middle | high
    }

    // config.visible should be true/undefined by default
    if (axisNameConfig.visible === false) {
        title.text = "";
    }

    // opposite Y axis in combo, column and line chart
    // should be rotated the same way as its counterpart
    // and text alignment reversed from default
    if (
        opposite &&
        isYAxis &&
        isOneOfTypes(chartOptions.type, [
            VisualizationTypes.COMBO,
            VisualizationTypes.COMBO2,
            VisualizationTypes.COLUMN,
            VisualizationTypes.LINE,
        ])
    ) {
        title.rotation = Number(ROTATE_NEGATIVE_90_DEGREES);
        if (title.align === "low") {
            title.textAlign = ALIGN_LEFT;
        } else if (title.align === "high") {
            title.textAlign = ALIGN_RIGHT;
        }
    }

    return title;
}

export function getAxisNameConfiguration(chartOptions: IChartOptions) {
    const configGetter = axisNameConfigGetter(chartOptions);
    return {
        xAxis: configGetter("x"),
        yAxis: configGetter("y"),
    };
}
