import { AreaChart as MantineAreaChart } from "@mantine/charts";
import {
    AreaChartCurveType,
    AreaChartSeries,
    AreaChartType,
} from "@mantine/charts/lib/AreaChart/AreaChart";
import { MantineColor } from "@mantine/core";
import { BoxProps } from "props/box";
import { GridChartBaseProps } from "props/charts";
import { DashBaseProps } from "props/dash";
import { StylesApiProps } from "props/styles";
import React, { useState } from "react";
import { getClickData, isEventValid } from "../../utils/charts";

interface Props
    extends BoxProps,
        GridChartBaseProps,
        StylesApiProps,
        DashBaseProps {
    /** Data used to display chart */
    data: Record<string, any>[];
    /** An array of objects with `name` and `color` keys. Determines which data should be consumed from the `data` array. */
    series: AreaChartSeries[];
    /** Controls how chart areas are positioned relative to each other, `'default'` by default */
    type?: AreaChartType;
    /** Determines whether the chart area should be represented with a gradient instead of the solid color, `false` by default */
    withGradient?: boolean;
    /** Type of the curve, `'monotone'` by default */
    curveType?: AreaChartCurveType;
    /** Determines whether dots should be displayed, `true` by default */
    withDots?: boolean;
    /** Props passed down to all dots. Ignored if `withDots={false}` is set. */
    dotProps?: object;
    /** Props passed down to all active dots. Ignored if `withDots={false}` is set. */
    activeDotProps?: object;
    /** Stroke width for the chart areas, `2` by default */
    strokeWidth?: number;
    /** Props passed down to recharts `AreaChart` component */
    areaChartProps?: object;
    /** Props passed down to recharts `Area` component */
    areaProps?: object;
    /** Controls fill opacity of all areas, `0.2` by default */    
    fillOpacity?: number;
    /** A tuple of colors used when `type="split"` is set, ignored in all other cases. A tuple may include theme colors reference or any valid CSS colors `['green.7', 'red.7']` by default. */
    splitColors?: [MantineColor, MantineColor];
    /** Offset for the split gradient. By default, value is inferred from `data` and `series` if possible. Must be generated from the data array with `getSplitOffset` function. */
    splitOffset?: number;
    /** Determines whether points with `null` values should be connected, `true` by default */
    connectNulls?: boolean;
    /** Additional components that are rendered inside recharts `AreaChart` component */
    children?: React.ReactNode;
    /** Click data */    
    clickData?: Record<string, any>;
    /** Hover data */
    hoverData?: Record<string, any>;
    /** Name of the series that was clicked */
    clickSeriesName?: Record<string, any>;
    /** Name of the series that is hovered*/
    hoverSeriesName?: Record<string, any>;
    /**Determines whether a hovered series is highlighted. True by default. Mirrors the behaviour when hovering about chart legend items*/
    highlightHover?: boolean
}

/** AreaChart */
const AreaChart = (props: Props) => {
    const { setProps, loading_state, clickData, hoverData, clickSeriesName, hoverSeriesName, series, highlightHover, areaChartProps, areaProps, ...others } = props;

    const [highlightedArea, setHighlightedArea] = useState(null);  
    const shouldHighlight = highlightHover && highlightedArea !== null;    


    const onClick = (ev) => {
        if (isEventValid(ev)) {
            setProps({ clickData: getClickData(ev) });
        }
    };

    const onMouseOver = (ev) => {       
        if (isEventValid(ev)) {
            setProps({ hoverData: getClickData(ev) });
        }
    };  

    const handleSeriesClick= (ev) => {        
        if (isEventValid(ev)) {
            setProps({ clickSeriesName: ev["name"] })
        }
    };

    const handleSeriesHover = (ev) => {
        
        if (isEventValid(ev)) {
            const hoveredSeriesName = ev["name"];
            setHighlightedArea(hoveredSeriesName);
            setProps({ hoverSeriesName: hoveredSeriesName });
        } 
    }; 

    const handleSeriesHoverEnd = () => {
        setHighlightedArea(null); // Reset highlighted area
    };

    const areaPropsFunction = (item) => {
        const dimmed = shouldHighlight && highlightedArea !== item.name;
        
        const returnProps : any = {        
            ...areaProps, 
            onClick: handleSeriesClick,
            onMouseOver: handleSeriesHover,
            onMouseOut: handleSeriesHoverEnd,            
        };
        
        /**if not dimmed, default behavior of Opacity will be triggered, including Hover over chart legend (BarChart.mjs)
            fillOpacity: dimmed ? 0.1 : fillOpacity,
            strokeOpacity: dimmed ? 0.2 : 0,
        */
        if (dimmed) {
            returnProps.fillOpacity = 0.1;
            returnProps.strokeOpacity = 0.2;
        }
        
        return returnProps;
    };

    const newProps = { ...areaChartProps, onClick, onMouseOver };

    return (
      <MantineAreaChart
        data-dash-is-loading={(loading_state && loading_state.is_loading) || undefined}
        areaChartProps={newProps}
        series={series}
        areaProps={areaPropsFunction}
        {...others}
      />
    );
}

AreaChart.defaultProps = {
    highlightHover: true,
};

export default AreaChart;
