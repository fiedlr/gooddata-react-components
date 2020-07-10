// (C) 2019-2020 GoodData Corporation
import noop = require("lodash/noop");
import * as referencePointMocks from "../../../../mocks/referencePointMocks";
import * as uiConfigMocks from "../../../../mocks/uiConfigMocks";
import { PluggableGeoPushpinChart } from "../PluggableGeoPushpinChart";
import { IExtendedReferencePoint, IVisConstruct } from "../../../../interfaces/Visualization";

describe("PluggableGeoPushpinChart", () => {
    const defaultProps: IVisConstruct = {
        projectId: "PROJECTID",
        element: "body",
        configPanelElement: null as string,
        callbacks: {
            afterRender: noop,
            pushData: noop,
        },
    };

    function createComponent(props: IVisConstruct = defaultProps) {
        return new PluggableGeoPushpinChart(props);
    }

    it("should create geo pushpin visualization", () => {
        const visualization = createComponent();

        expect(visualization).toBeTruthy();
    });

    describe("getExtendedReferencePoint", () => {
        const geoPushpin = createComponent();
        const sourceReferencePoint = referencePointMocks.simpleGeoPushpinReferencePoint;
        const extendedReferencePointPromise: Promise<
            IExtendedReferencePoint
        > = geoPushpin.getExtendedReferencePoint(sourceReferencePoint);

        it("should return a new reference point with geoPushpin adapted buckets", () => {
            return extendedReferencePointPromise.then(extendedReferencePoint => {
                expect(extendedReferencePoint.buckets).toEqual(sourceReferencePoint.buckets);
            });
        });

        it("should return a new reference point with geoPushpin UI config", () => {
            return extendedReferencePointPromise.then(extendedReferencePoint => {
                expect(extendedReferencePoint.uiConfig).toEqual(uiConfigMocks.defaultGeoPushpinUiConfig);
            });
        });

        it("should transform view by attribute to location attribute", async () => {
            const { oneMetricAndGeoCategoryAndStackReferencePoint } = referencePointMocks;

            const newExtendedReferencePoint = await geoPushpin.getExtendedReferencePoint(
                oneMetricAndGeoCategoryAndStackReferencePoint,
            );

            expect(newExtendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [
                        {
                            localIdentifier: "a1",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.owner.country",
                            locationDisplayFormUri: "/geo/attribute/displayform/uri/1",
                            dfUri: "/geo/attribute/displayform/uri/2",
                        },
                    ],
                },
                {
                    localIdentifier: "size",
                    items: [
                        {
                            localIdentifier: "m1",
                            type: "metric",
                            aggregation: null,
                            attribute: "aazb6kroa3iC",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "color",
                    items: [],
                },
                {
                    localIdentifier: "segment",
                    items: [
                        {
                            localIdentifier: "a2",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.stage.iswon",
                        },
                    ],
                },
            ]);
        });

        it("should transform geo attribute with attribute", async () => {
            const { viewByWithDateAndGeoAttributeReferencePoint } = referencePointMocks;

            const newExtendedReferencePoint = await geoPushpin.getExtendedReferencePoint(
                viewByWithDateAndGeoAttributeReferencePoint,
            );

            expect(newExtendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [
                        {
                            localIdentifier: "a1",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.owner.country",
                            locationDisplayFormUri: "/geo/attribute/displayform/uri/1",
                            dfUri: "/geo/attribute/displayform/uri/2",
                        },
                    ],
                },
                {
                    localIdentifier: "size",
                    items: [
                        {
                            localIdentifier: "m1",
                            type: "metric",
                            aggregation: null,
                            attribute: "aazb6kroa3iC",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "color",
                    items: [],
                },
                {
                    localIdentifier: "segment",
                    items: [],
                },
            ]);
        });

        it("should not transform same location attribute on location and segment bucket", async () => {
            const { viewByWithNonGeoAndGeoAttributeReferencePoint } = referencePointMocks;

            const newExtendedReferencePoint = await geoPushpin.getExtendedReferencePoint(
                viewByWithNonGeoAndGeoAttributeReferencePoint,
            );

            expect(newExtendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [
                        {
                            localIdentifier: "a1",
                            type: "attribute",
                            aggregation: null,
                            attribute: "attr.owner.country",
                            locationDisplayFormUri: "/geo/attribute/displayform/uri/1",
                            dfUri: "/geo/attribute/displayform/uri/2",
                        },
                    ],
                },
                {
                    localIdentifier: "size",
                    items: [
                        {
                            localIdentifier: "m1",
                            type: "metric",
                            aggregation: null,
                            attribute: "aazb6kroa3iC",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "color",
                    items: [],
                },
                {
                    localIdentifier: "segment",
                    items: [
                        {
                            aggregation: null,
                            attribute: "attr.owner.department",
                            localIdentifier: "a1",
                            type: "attribute",
                        },
                    ],
                },
            ]);
        });

        it("should reset showInPercent and showOnSecondaryAxis for size and color measures", async () => {
            const newExtendedReferencePoint = await geoPushpin.getExtendedReferencePoint(
                referencePointMocks.twoMeasuresWithShowInPercentOnSecondaryAxisReferencePoint,
            );
            expect(newExtendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [
                        {
                            aggregation: null,
                            attribute: "attr.owner.country",
                            dfUri: "/geo/attribute/displayform/uri/2",
                            localIdentifier: "a1",
                            locationDisplayFormUri: "/geo/attribute/displayform/uri/1",
                            type: "attribute",
                        },
                    ],
                },
                {
                    localIdentifier: "size",
                    items: [
                        {
                            localIdentifier: "m3",
                            type: "metric",
                            aggregation: null,
                            attribute: "dt.opportunitysnapshot.snapshotdate",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "color",
                    items: [
                        {
                            localIdentifier: "m4",
                            type: "metric",
                            aggregation: null,
                            attribute: "acfWntEMcom0",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "segment",
                    items: [],
                },
            ]);
        });

        it("should return a new reference point with geoPushpin supported properties list", async () => {
            const geoPushpinChart = createComponent();
            const extendedReferencePoint = await geoPushpinChart.getExtendedReferencePoint(
                referencePointMocks.simpleGeoPushpinReferencePoint,
            );
            expect(extendedReferencePoint.properties).toEqual({
                controls: {
                    points: {
                        groupNearbyPoints: false,
                    },
                    tooltipText: "/geo/attribute/displayform/uri/2",
                },
            });
        });

        it("should remove all derived measures", async () => {
            const geoPushpinChart = createComponent();
            const extendedReferencePoint = await geoPushpinChart.getExtendedReferencePoint(
                referencePointMocks.samePeriodPreviousYearRefPoint,
            );

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [],
                },
                {
                    localIdentifier: "size",
                    items: [
                        {
                            localIdentifier: "m1",
                            type: "metric",
                            aggregation: null,
                            attribute: "aazb6kroa3iC",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "color",
                    items: [],
                },
                {
                    localIdentifier: "segment",
                    items: [],
                },
            ]);
        });

        it("should remove all arithmetic measures", async () => {
            const geoPushpinChart = createComponent();
            const extendedReferencePoint = await geoPushpinChart.getExtendedReferencePoint(
                referencePointMocks.firstMeasureArithmeticNoAttributeReferencePoint,
            );

            expect(extendedReferencePoint.buckets).toEqual([
                {
                    localIdentifier: "location",
                    items: [],
                },
                {
                    localIdentifier: "size",
                    items: [
                        {
                            localIdentifier: "m1",
                            type: "metric",
                            aggregation: null,
                            attribute: "aazb6kroa3iC",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "color",
                    items: [
                        {
                            localIdentifier: "m2",
                            type: "metric",
                            aggregation: null,
                            attribute: "af2Ewj9Re2vK",
                            showInPercent: null,
                            showOnSecondaryAxis: null,
                        },
                    ],
                },
                {
                    localIdentifier: "segment",
                    items: [],
                },
            ]);
        });
    });
});
