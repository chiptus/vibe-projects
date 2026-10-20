import { LEVEL_LABEL } from "../../program/registry";
import type { Level } from "../../program/types";
import { Card } from "../Card";
import { Button } from "../ui/Button";

interface RecommendationCardProps {
  level: Level;
  onSwitch: (level: Level) => void;
}

export function RecommendationCard({ level, onSwitch }: RecommendationCardProps) {
  return (
    <Card title={`Recommended: ${LEVEL_LABEL[level]}`}>
      <p className="mb-2.5 text-base text-mu">Your results qualify you for this program.</p>
      <Button className="w-full" onClick={() => onSwitch(level)}>
        Switch to {LEVEL_LABEL[level]}
      </Button>
    </Card>
  );
}
