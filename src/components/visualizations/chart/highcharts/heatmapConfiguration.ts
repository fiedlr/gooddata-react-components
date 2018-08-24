// (C) 2007-2018 GoodData Corporation
import cloneDeep = require('lodash/cloneDeep');

const HEATMAP_TEMPLATE = {
    chart: {
        type: 'heatmap',
        marginTop: 0,
        marginRight: 0,
        spacingRight: 0
    },
    defs: {
        // Doesn't work because styled mode is not enabled
        emptyDataPattern: {
            tagName: 'pattern',
            id: 'empty-data-pattern',
            patternUnits: 'userSpaceOnUse',
            width: 10,
            height: 10,
            children: [{
                tagName: 'path',
                d: 'M 10 0 L 0 10 M 9 11 L 11 9 M 4 11 L 11 4 M -1 1 L 1 -1 M -1 6 L 6 -1'
            }]
        }
    },
    plotOptions: {
        heatmap: {
            point: {
                events: {
                    // from Highcharts 5.0.0 cursor can be set by using 'className' for individual data items
                    mouseOver() {
                        if (this.drilldown) {
                            this.graphic.element.style.cursor = 'pointer';
                        }
                    }
                }
            }
        }
    },
    series: [{
        borderWidth: 0,
        nullColor: 'url(#empty-data-pattern)',
        dataLabels: {
            allowOverlap: false
        }
    }]
};

export function getHeatmapConfiguration() {
    return cloneDeep(HEATMAP_TEMPLATE);
}
