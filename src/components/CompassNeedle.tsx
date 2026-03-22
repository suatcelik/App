import React, { useEffect, useRef } from "react";
import { View, Animated, Text } from "react-native";
import Svg, { Circle, Polygon, G, Line, Text as SvgText } from "react-native-svg";

interface CompassNeedleProps {
  heading: number;
  qiblaAngle: number;
}

export function CompassNeedle({ heading, qiblaAngle }: CompassNeedleProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const prevHeading = useRef(heading);

  useEffect(() => {
    const delta = heading - prevHeading.current;
    prevHeading.current = heading;

    Animated.timing(rotateAnim, {
      toValue: -heading,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  const rotation = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  const qiblaRotation = qiblaAngle - heading;

  const SIZE = 260;
  const CENTER = SIZE / 2;
  const RADIUS = CENTER - 16;

  const directions = [
    { label: "K", angle: 0 },
    { label: "KD", angle: 45 },
    { label: "D", angle: 90 },
    { label: "GD", angle: 135 },
    { label: "G", angle: 180 },
    { label: "GB", angle: 225 },
    { label: "B", angle: 270 },
    { label: "KB", angle: 315 },
  ];

  return (
    <View className="items-center">
      <View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: "#0f2d47",
          borderWidth: 2,
          borderColor: "#d4af37",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#d4af37",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Animated.View
          style={{
            width: SIZE,
            height: SIZE,
            transform: [{ rotate: rotation }],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width={SIZE} height={SIZE}>
            {directions.map(({ label, angle }) => {
              const rad = ((angle - 90) * Math.PI) / 180;
              const x = CENTER + (RADIUS - 20) * Math.cos(rad);
              const y = CENTER + (RADIUS - 20) * Math.sin(rad);
              return (
                <SvgText
                  key={label}
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize={angle % 90 === 0 ? 14 : 10}
                  fontWeight={angle % 90 === 0 ? "bold" : "normal"}
                  fill={angle === 0 ? "#ef4444" : "#9ca3af"}
                >
                  {label}
                </SvgText>
              );
            })}
            {/* Tick marks */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = i * 10;
              const rad = ((angle - 90) * Math.PI) / 180;
              const isMajor = angle % 90 === 0;
              const tickLen = isMajor ? 12 : 6;
              const x1 = CENTER + (RADIUS - 2) * Math.cos(rad);
              const y1 = CENTER + (RADIUS - 2) * Math.sin(rad);
              const x2 = CENTER + (RADIUS - tickLen) * Math.cos(rad);
              const y2 = CENTER + (RADIUS - tickLen) * Math.sin(rad);
              return (
                <Line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? "#d4af37" : "#4b5563"}
                  strokeWidth={isMajor ? 2 : 1}
                />
              );
            })}
          </Svg>
        </Animated.View>

        {/* Qibla needle - fixed on screen, rotates relative to compass */}
        <View
          style={{
            position: "absolute",
            width: SIZE,
            height: SIZE,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ rotate: `${qiblaRotation}deg` }],
          }}
        >
          <Svg width={SIZE} height={SIZE}>
            {/* Qibla arrow */}
            <Polygon
              points={`${CENTER},${CENTER - RADIUS + 30} ${CENTER - 8},${CENTER + 20} ${CENTER + 8},${CENTER + 20}`}
              fill="#d4af37"
              opacity={0.9}
            />
            <Circle cx={CENTER} cy={CENTER} r={8} fill="#d4af37" />
            {/* Kaaba emoji label */}
            <SvgText
              x={CENTER}
              y={CENTER - RADIUS + 22}
              textAnchor="middle"
              fontSize={12}
              fill="#d4af37"
              fontWeight="bold"
            >
              🕋
            </SvgText>
          </Svg>
        </View>
      </View>

      <View className="mt-4 items-center">
        <Text className="text-gold font-bold text-lg">
          Kıble: {Math.round(qiblaAngle)}°
        </Text>
        <Text className="text-gray-400 text-sm mt-1">
          Pusula: {Math.round(heading)}°
        </Text>
      </View>
    </View>
  );
}
