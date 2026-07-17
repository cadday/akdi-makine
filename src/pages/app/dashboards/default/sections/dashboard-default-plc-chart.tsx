import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { usePlcData } from "@/context/plc-context";
import { Card, CardContent, Typography } from "@mui/material";

interface HistoryPoint {
  time: string;
  d10: number;
  d20: number;
}

export function DashboardDefaultPLCChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const { telemetry } = usePlcData();

  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const MAX_POINTS = 50;

  // 1. Initialize ECharts Canvas Instance on Mount
  useEffect(() => {
    if (!chartRef.current) return;

    // Boot up the canvas renderer using the clean default/light configuration
    const chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" });
    chartInstanceRef.current = chart;

    // Define the custom light-themed configuration
    chart.setOption({
      backgroundColor: "transparent",
      title: {
        text: "Real-Time Register Trends",
        textStyle: { color: "#1e293b", fontSize: 14, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        textStyle: { color: "#1e293b" },
        extraCssText: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 8px;",
      },
      legend: {
        data: ["Register D10", "Register D20"],
        textStyle: { color: "#475569", fontWeight: 500 },
        right: "10%",
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "12%", // 💡 Expanded slightly from 10% to prevent slanted X labels from clipping
        top: "15%",
        containLabel: true, // 💡 Crucial: Forces the grid box to always resize so text is fully visible
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [],
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: {
          color: "#64748b",
          fontWeight: 500,
          interval: "auto", // 💡 Automatically calculate spacing based on layout width
          hideOverlap: true, // 💡 Forces overlapping text blocks to turn invisible
          rotate: 30, // 💡 Optional: Slants text at an angle for tighter layouts
        },
      },
      yAxis: {
        type: "value",
        minInterval: 1, // 💡 Stops the Y-axis from spawning micro-decimal step slices (e.g., 10.1, 10.2)
        splitLine: { lineStyle: { color: "#f1f5f9", type: "solid" } },
        axisLine: { show: false },
        axisLabel: {
          color: "#64748b",
          fontWeight: 500,
          hideOverlap: true, // 💡 Prevents vertical labels from collapsing onto one another
        },
      },
      series: [
        {
          name: "Register D10",
          type: "line",
          showSymbol: false,
          smooth: true,
          data: [],
          lineStyle: { width: 3, color: "#0097DC" }, // Your custom target color 1
          itemStyle: { color: "#0097DC" },
        },
        {
          name: "Register D20",
          type: "line",
          showSymbol: false,
          smooth: true,
          data: [],
          lineStyle: { width: 3, color: "#103EC6" }, // Your custom target color 2
          itemStyle: { color: "#103EC6" },
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, []);

  // 2. Catch incoming telemetry streams and shift data windows
  useEffect(() => {
    if (telemetry.timestamp === "--:--:--") return;
    if (!telemetry.m1Status && !telemetry.m2Status) return;
    setHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, { time: telemetry.timestamp, d10: telemetry.d10Value, d20: telemetry.d20Value }];

      if (updatedHistory.length > MAX_POINTS) {
        updatedHistory.shift();
      }
      return updatedHistory;
    });
  }, [telemetry]);

  // 3. Inject history updates into the canvas frame efficiently
  useEffect(() => {
    if (!chartInstanceRef.current || history.length === 0) return;

    chartInstanceRef.current.setOption({
      xAxis: {
        data: history.map((pt) => pt.time),
      },
      series: [
        { name: "Register D10", data: history.map((pt) => pt.d10) },
        { name: "Register D20", data: history.map((pt) => pt.d20) },
      ],
    });
  }, [history]);

  return (
    <>
      <Typography variant='h6' component='h6' className='mt-2 mb-3 lg:mt-0'>
        Test Chart
      </Typography>
      <Card>
        <CardContent>
          <div ref={chartRef} className='w-full h-80' />
        </CardContent>
      </Card>
    </>
  );
}
